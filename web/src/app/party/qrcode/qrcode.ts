import { Component, computed, inject, input, resource } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Party } from '../party.model';
import QRCode from 'qrcode';
import { ZardSonnerService } from '@/shared/components/sonner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qrcode',
  imports: [],
  templateUrl: './qrcode.html',
  styleUrl: './qrcode.css',
})
export class Qrcode {
  party = input.required<Party>()
  qrcodeResource = resource<SafeHtml | null, Party | undefined>({
    params: () => this.party(),
    loader: async ({ params }) => {
      const party = params;
      if (!party) {
        return null;
      }
      const urlToJoin = this.getCopyLink(party);
      console.log(party, urlToJoin)
      const qrcodeGenerated = await QRCode.toString(urlToJoin);
      return this.sanitize.bypassSecurityTrustHtml(qrcodeGenerated);
    },
  });
  qrcode = computed(() => this.qrcodeResource.value());
  sanitize = inject(DomSanitizer);
  router = inject(Router);
  protected readonly sonner = inject(ZardSonnerService);

  getCopyLink(party: Party): string {
    const urlTree = this.router.createUrlTree(['party', party.uuid, 'join']);
    return `${window.location.origin}${this.router.serializeUrl(urlTree)}${party.password ? `?password=${party.password}` : ''}`;
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
}
