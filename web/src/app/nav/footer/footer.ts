import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, ZardButtonComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {}
