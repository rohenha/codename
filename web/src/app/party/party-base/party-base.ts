import { Component, computed, inject, input, OnDestroy, resource, signal } from '@angular/core';
import { filter, firstValueFrom } from 'rxjs';
import { PartyService } from '@/party/party-service';
import { Party } from '@/party/party.model';
import { Router, RouterLink } from '@angular/router';
import { ZardSpinnerComponent } from '@/shared/components/spinner';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import QRCode from 'qrcode';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardSonnerService } from '@/shared/components/sonner';
import { AuthService } from '@/auth/auth-service';
import { UserCardSm } from '../user-card-sm/user-card-sm';
import { SseService } from '@/sse/sse-service';
import { toObservable } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from '@adonisjs/transmit-client';

@Component({
  selector: 'app-party-base',
  imports: [ZardSpinnerComponent, ZardButtonComponent, RouterLink, UserCardSm],
  templateUrl: './party-base.html',
  styleUrl: './party-base.css',
})
export class PartyBase implements OnDestroy {
  partyId = input.required<string>();
  partyService = inject(PartyService);
  sanitize = inject(DomSanitizer);
  authService = inject(AuthService);
  router = inject(Router);
  sseService = inject(SseService)
  protected readonly sonner = inject(ZardSonnerService);

  partyResource = resource<Party, string>({
    params: () => this.partyId(),
    loader: async ({ params }) => firstValueFrom(this.partyService.getParty(params)),
  });

  qrcodeResource = resource<SafeHtml | null, Party | undefined>({
    params: () => this.partyResource.value(),
    loader: async ({ params }) => {
      const party = params;
      if (!party) {
        return null;
      }
      const urlToJoin = this.getCopyLink(party);
      const qrcodeGenerated = await QRCode.toString(urlToJoin);
      return this.sanitize.bypassSecurityTrustHtml(qrcodeGenerated);
    },

  });
  qrcode = computed(() => this.qrcodeResource.value());
  isUserAdmin = computed(() => {
    const user = this.authService.currentUser();
    const party = this.partyResource.value();
    return Boolean(party && user && user.id === party.adminId);
  });

  loadingDelete = signal(false);
  deleteId = signal<number | undefined>(undefined);

  usersSubscription: Subscription|undefined

  // constructor() {
  //   effect(() => {
  //     const err = this.partyResource.error();
  //     console.log(err)
  //     if (err) {
  //       this.sonner.error('Party does not exist');
  //     }
  //   });
  // }

  constructor() {
    // --- SUCCÈS : connecter le SSE ---
    toObservable(this.partyResource.value)
      .pipe(
        filter((party): party is Party => !!party), // ignore undefined au départ
      )
      .subscribe(async (party) => {
        if (!this.usersSubscription) {
          this.usersSubscription = await this.sseService.usersSubscription(party.uuid, (data) => {
            console.log(data)
            this.partyResource.reload()
          })
        }
      });

    // --- ERREUR : toast 403 ---
    toObservable(this.partyResource.error)
      .pipe(
        filter((err): err is HttpErrorResponse => !!err),
      )
      .subscribe(async (err) => {
        await this.usersSubscription?.delete()
        if (err.status === 403) {
          this.sonner.error('Accès interdit');
        }
      });
  }

  ngOnDestroy(): void {
    this.usersSubscription?.delete()
  }


  getCopyLink(party: Party): string {
    const urlTree = this.router.createUrlTree(['party', party.uuid, 'join']);
    return `${window.location.origin}${this.router.serializeUrl(urlTree)}?password=${party.password}`;
  }

  async copyLink() {
    const party = this.partyResource.value();
    if (!party) {
      this.sonner.error('Link error');
      return;
    }
    const urlToJoin = this.getCopyLink(party);
    await navigator.clipboard.writeText(urlToJoin);
    this.sonner.success('link copied !');
  }

  afterDeleteUser(partyUpdated: Party) {
    this.deleteId.set(undefined)
    this.partyResource.update(() => partyUpdated);
  }
}
