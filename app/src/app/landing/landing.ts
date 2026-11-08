import { AuthService } from '@/auth/auth-service';
import { ZardButtonComponent } from '@/shared/components/button';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZardCardHeaderComponent, ZardCardComponent, ZardCardFooterComponent } from '@/shared/components/card';

@Component({
  selector: 'app-landing',
  imports: [ZardButtonComponent, RouterLink, ZardCardHeaderComponent, ZardCardComponent, ZardCardFooterComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  authService = inject(AuthService)
  parties = computed(() => {
    const currentUser = this.authService.currentUser()
    if (!currentUser) {
      return []
    }
    return currentUser.parties
  })
}
