import { AuthService } from '@/auth/auth-service';
import { ZardButtonComponent } from '@/shared/components/button';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router'
import { PartiesList } from '@/profile/parties-list/parties-list';

@Component({
  selector: 'app-landing',
  imports: [ZardButtonComponent, RouterLink, PartiesList],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  authService = inject(AuthService)
}
