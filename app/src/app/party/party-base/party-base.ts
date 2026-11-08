import { Component, effect, inject, input, signal } from '@angular/core';
import { PartyService } from '@/party/party-service';
import { Party } from '@/party//party.model';
import { Router, RouterLink } from '@angular/router';
import { ZardSpinnerComponent } from '@/shared/components/spinner';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import QRCode from 'qrcode'
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardSonnerService } from '@/shared/components/sonner';
import { ZardBadgeComponent } from '@/shared/components/badge';

@Component({
  selector: 'app-party-base',
  imports: [ZardSpinnerComponent, ZardButtonComponent, RouterLink, ZardBadgeComponent],
  templateUrl: './party-base.html',
  styleUrl: './party-base.css',
})
export class PartyBase {
  partyId = input.required<string>()
  partyService = inject(PartyService)
  sanitize = inject(DomSanitizer)
  party = signal<Party | undefined>(undefined)
  router = inject(Router)
  loading = signal(true)
  protected readonly sonner = inject(ZardSonnerService)
  qrcode = signal<SafeHtml | null>('')
  constructor() {
    effect(() => {
      const partyId = this.partyId()
      if (partyId) {
        this.partyService.getParty(partyId).subscribe({
          next: async (party) => {
            this.party.set(party)
            const qrcodeSanitized = await this.generateQrCodeUrl(partyId)
            this.loading.set(false)
            this.qrcode.set(qrcodeSanitized)
          },
          error: () => {
            this.sonner.error('Party does not exist')
            this.router.navigateByUrl('')
          },
        })
      }
    })
  }

  async generateQrCodeUrl(partyId: string) {
    const urlTree = this.router.createUrlTree(['/join', partyId])
    const urlToJoin = `${window.location.origin}${this.router.serializeUrl(urlTree)}`
    const qrcodeGenerated = await QRCode.toString(urlToJoin)
    return this.sanitize.bypassSecurityTrustHtml(qrcodeGenerated);
  }
}
