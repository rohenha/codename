import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { Party } from '@/party/party.model';

@Component({
  selector: 'app-party-card',
  imports: [RouterLink, ZardButtonComponent, ZardBadgeComponent],
  templateUrl: './party-card.html',
  styleUrl: './party-card.css',
})
export class PartyCard {
  party = input.required<Party>()
}
