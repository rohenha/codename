import { Component, computed, effect, inject, input, resource, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
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

@Component({
  selector: 'app-party-base',
  imports: [ZardSpinnerComponent, ZardButtonComponent, RouterLink, UserCardSm],
  templateUrl: './party-base.html',
  styleUrl: './party-base.css',
})
export class PartyBase {
  partyId = input.required<string>();
  partyService = inject(PartyService);
  sanitize = inject(DomSanitizer);
  authService = inject(AuthService);
  router = inject(Router);
  protected readonly sonner = inject(ZardSonnerService);

  partyResource = resource<Party, string>({
    params: () => this.partyId(),
    loader: async ({ params }) => firstValueFrom(this.partyService.getParty(params)),
  });

  party = computed(() => this.partyResource.value());
  loading = this.partyResource.isLoading;

  qrcodeResource = resource<SafeHtml | null, Party | undefined>({
    params: () => this.party(),
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
    const party = this.party();
    return Boolean(party && user && user.id === party.adminId);
  });

  loadingDelete = signal(false);
  deleteId = signal<number | undefined>(undefined);

  constructor() {
    effect(() => {
      const err = this.partyResource.error();
      if (err) {
        this.sonner.error('Party does not exist');
      }
    });
  }

  getCopyLink(party: Party): string {
    const urlTree = this.router.createUrlTree(['party', party.uuid, 'join']);
    return `${window.location.origin}${this.router.serializeUrl(urlTree)}?password=${party.password}`;
  }

  async copyLink() {
    const party = this.party();
    if (!party) {
      this.sonner.error('Link error');
      return;
    }
    const urlToJoin = this.getCopyLink(party);
    await navigator.clipboard.writeText(urlToJoin);
    this.sonner.success('link copied !');
  }

  afterDeleteUser(partyUpdated: Party) {
    this.partyResource.update(() => partyUpdated);
  }
}
