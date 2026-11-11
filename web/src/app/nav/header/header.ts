import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ZardButtonComponent } from '@/shared/components/button';
import { AuthService } from '@/auth/auth-service';
import { ZardSonnerService } from '@/shared/components/sonner';
import { ZardAvatarComponent } from '@/shared/components/avatar';

@Component({
  selector: 'app-header',
  imports: [RouterLink, ZardButtonComponent, ZardAvatarComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  authService = inject(AuthService)
  router = inject(Router)
  protected readonly sonner = inject(ZardSonnerService)

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.sonner.success('Logout success')
        this.router.navigateByUrl('/')
      }
    })
  }
}
