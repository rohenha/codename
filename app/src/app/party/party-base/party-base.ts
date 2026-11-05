import { Component, effect, inject, input, signal } from '@angular/core';
import { PartyService } from '@/party/party-service';
import { Party } from '@/party//party.model';
import { Router } from '@angular/router';
import { ZardSpinnerComponent } from '@/shared/components/spinner';

@Component({
  selector: 'app-party-base',
  imports: [ZardSpinnerComponent],
  templateUrl: './party-base.html',
  styleUrl: './party-base.css',
})
export class PartyBase {
  partyId = input.required<string>()
  partyService = inject(PartyService)
  party = signal<Party | undefined>(undefined)
  router = inject(Router)
  loading = signal(true)
  constructor() {
    effect(() => {
      const partyId = this.partyId()
      if (partyId) {
        this.partyService.getParty(partyId).subscribe({
          next: (party) => {
            this.party.set(party)
            this.loading.set(false)
          },
          error: () => {
            this.router.navigateByUrl('')
          },
        })
      }
    })
  }
}
