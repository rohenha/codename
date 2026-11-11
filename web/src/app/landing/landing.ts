import { AuthService } from '@/auth/auth-service';
import { ZardButtonComponent } from '@/shared/components/button';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router'
import { ZardSonnerService } from '@/shared/components/sonner';
import { PartiesList } from '@/profile/parties-list/parties-list';

@Component({
  selector: 'app-landing',
  imports: [ZardButtonComponent, RouterLink, PartiesList],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  authService = inject(AuthService)
  protected readonly sonner = inject(ZardSonnerService)

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.sonner.success('Logout success')
      }
    })
  }
}
