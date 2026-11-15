import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Party } from '@/party/party.model';
import { ProfileService } from '../profile-service';
import { ZardButtonComponent } from '@/shared/components/button';
import { PartyCardSkeleton } from '../party-card-skeleton/party-card-skeleton';
import { PartyCard } from '../party-card/party-card';

@Component({
  selector: 'app-parties-list',
  imports: [RouterLink, ZardButtonComponent, PartyCardSkeleton, PartyCard],
  templateUrl: './parties-list.html',
  styleUrl: './parties-list.css',
})
export class PartiesList {
  profileService = inject(ProfileService)
  parties = signal<Party[]>([])
  loading =  signal<boolean>(true)
  constructor() {
    this.profileService.getParties().subscribe({
      next: (parties) => {
        this.loading.set(false)
        this.parties.set(parties)
      },
      error: () => {
        this.loading.set(false)
      }
    })
  }
}
