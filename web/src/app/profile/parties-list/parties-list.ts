import { Component, inject, signal } from '@angular/core';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { RouterLink } from '@angular/router';
import { Party } from '@/party/party.model';
import { ProfileService } from '../profile-service';
import { ZardButtonComponent } from '@/shared/components/button';
@Component({
  selector: 'app-parties-list',
  imports: [ZardBadgeComponent, RouterLink, ZardButtonComponent],
  templateUrl: './parties-list.html',
  styleUrl: './parties-list.css',
})
export class PartiesList {
  profileService = inject(ProfileService)
  parties = signal<Party[]>([])

  constructor() {
    this.profileService.getParties().subscribe({
      next: (parties) => {
        this.parties.set(parties)
      }
    })
  }
}
