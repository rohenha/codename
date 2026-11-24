import { Component, computed, inject, input, resource, signal } from '@angular/core';
import { filter, firstValueFrom } from 'rxjs';
import { PartyService } from '@/party/party-service';
import { Party } from '@/party/party.model';
import { Router, RouterLink } from '@angular/router';
import { ZardSpinnerComponent } from '@/shared/components/spinner';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardSonnerService } from '@/shared/components/sonner';
import { AuthService } from '@/auth/auth-service';
import { UserCardSm } from '../user-card-sm/user-card-sm';
import { SseService } from '@/sse/sse-service';
import { toObservable } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Qrcode } from '../qrcode/qrcode';

@Component({
  selector: 'app-party-dashboard',
  imports: [ZardSpinnerComponent, ZardButtonComponent, RouterLink, UserCardSm, Qrcode],
  templateUrl: './party-dashboard.html',
  styleUrl: './party-dashboard.css',
})
export class PartyDashboard {
  partyId = input.required<string>();
  partyService = inject(PartyService);
  authService = inject(AuthService);
  router = inject(Router);
  sseService = inject(SseService)
  protected readonly sonner = inject(ZardSonnerService);

  partyResource = resource<Party, string>({
    params: () => this.partyId(),
    loader: async ({ params }) => firstValueFrom(this.partyService.getParty(params)),
  });

  isUserAdmin = computed(() => {
    const user = this.authService.currentUser();
    const party = this.partyResource.value();
    return Boolean(party && user && user.id === party.adminId);
  });

  loadingDelete = signal(false);
  deleteId = signal<number | undefined>(undefined);

  constructor() {
    // --- SUCCÈS : connecter le SSE ---
    toObservable(this.partyResource.value)
      .pipe(
        filter((party): party is Party => !!party), // ignore undefined au départ
      )
      .subscribe(async (party) => {
        await this.sseService.partySubscription(party.uuid, this.onBroadcast.bind(this))
      });

    // --- ERREUR : toast 403 ---
    toObservable(this.partyResource.error)
      .pipe(
        filter((err): err is HttpErrorResponse => !!err),
      )
      .subscribe(async (err) => {
        await this.sseService.clearSubscription()
        // await this.partySubscription?.delete()
        if (err.status === 403) {
          this.sonner.error('Accès interdit');
        }
        this.router.navigateByUrl('/')
      });
  }

  afterDeleteUser(partyUpdated: Party) {
    this.deleteId.set(undefined)
    this.partyResource.update(() => partyUpdated);
  }

  onBroadcast(data: { status: string, message: string }) {
    const partyId = this.partyId()
    console.log(data.status)
    switch (data.status) {
      case 'user_added':
        this.partyResource.reload()
        break;
      case 'user_removed':
        this.partyResource.reload()
        break;
      case 'start_party':
        this.router.navigateByUrl(`/party/${partyId}/teams`)
        break;
      default:
        break;
    }
  }

  async initParty() {
    const partyId = this.partyId()
    this.partyService.initParty(partyId).subscribe({
      // next: () => {
      //   this.router.navigateByUrl(`/party/${partyId}/teams`)
      // }
    })
  }
}
