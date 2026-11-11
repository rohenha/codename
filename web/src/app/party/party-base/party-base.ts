import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { PartyService } from '@/party/party-service';
import { Party } from '@/party//party.model';
import { Router, RouterLink } from '@angular/router';
import { ZardSpinnerComponent } from '@/shared/components/spinner';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import QRCode from 'qrcode'
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardSonnerService } from '@/shared/components/sonner';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { AuthService } from '@/auth/auth-service';
import { ZardItemComponent, ZardItemMediaComponent, ZardItemContentComponent, ZardItemTitleComponent, ZardItemActionsComponent } from '@/shared/components/item';
import { NgIcon } from '@ng-icons/core';
import { delayLoading } from '@/tools/events';

@Component({
  selector: 'app-party-base',
  imports: [ZardSpinnerComponent, ZardButtonComponent, RouterLink, ZardBadgeComponent, ZardItemComponent, ZardItemMediaComponent, ZardItemContentComponent, ZardItemTitleComponent, ZardItemActionsComponent, NgIcon],
  templateUrl: './party-base.html',
  styleUrl: './party-base.css',
})
export class PartyBase {
  partyId = input.required<string>()
  partyService = inject(PartyService)
  sanitize = inject(DomSanitizer)
  authService = inject(AuthService)
  party = signal<Party | undefined>(undefined)
  router = inject(Router)
  loading = signal(true)
  loadingDelete = signal(false)
  deleteId = signal<number|undefined>(undefined)
  protected readonly sonner = inject(ZardSonnerService)
  qrcode = signal<SafeHtml | null>('')
  isUserAdmin = computed(() => {
    const user = this.authService.currentUser()
    const party = this.party()
    if (!party || !user || user.id !== party.adminId) {
      return false
    }

    return true
  })
  constructor() {
    effect(() => {
      const partyId = this.partyId()
      if (partyId) {
        this.partyService.getParty(partyId).subscribe({
          next: async (party) => {
            this.party.set(party)
            const qrcodeSanitized = await this.generateQrCodeUrl()
            this.loading.set(false)
            this.qrcode.set(qrcodeSanitized)
          },
          error: () => {
            this.loading.set(false)
            this.sonner.error('Party does not exist')
            // this.router.navigateByUrl('')
          },
        })
      }
    })
  }

  getCopyLink(): string {
    const party = this.party()
    if (!party) {
      return ''
    }
    const urlTree = this.router.createUrlTree(['party' , party.uuid, 'join'])
    return `${window.location.origin}${this.router.serializeUrl(urlTree)}?password=${party.password}`
  }

  async generateQrCodeUrl() {
    const urlToJoin = this.getCopyLink()
    const qrcodeGenerated = await QRCode.toString(urlToJoin)
    return this.sanitize.bypassSecurityTrustHtml(qrcodeGenerated);
  }

  async copyLink() {
    const urlToJoin = this.getCopyLink()
    if (!urlToJoin) {
      this.sonner.error('Link error')
      return
    }
    await navigator.clipboard.writeText(urlToJoin);
    this.sonner.success('link copied !')
  }

  async removeUser() {
    const party = this.party()
    const deleteId = this.deleteId()
    const loadingDelete = this.loadingDelete()
    if (!party || !deleteId || loadingDelete) {
      return
    }

    const delayCancel = delayLoading(() => {
      this.loadingDelete.set(true)
      return () => void 0
    }, 100)

    this.partyService.removeUser(party.uuid, { userId: deleteId}).subscribe({
      next: (partyUpdated) => {
        const userDeleted = party.users.find((user) => user.id === deleteId)
        this.sonner.success(`User ${userDeleted?.username} has been deleted`)
        this.party.set(partyUpdated)
        delayCancel(() => {
          this.loadingDelete.set(false)
        })
      },
      error: () => {
        const userDeleted = party.users.find((user) => user.id === deleteId)
        this.sonner.success(`There is an error when deleting ${userDeleted?.username}`)
        delayCancel(() => {
          this.loadingDelete.set(false)
        })
      }
    })
  }
}
