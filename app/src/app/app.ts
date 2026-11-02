import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ZardButtonComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
