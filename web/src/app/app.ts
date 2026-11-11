import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ZardSonnerComponent } from '@/shared/components/sonner/sonner.component';
import { Header } from './nav/header/header';
import { Footer } from './nav/footer/footer';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ZardSonnerComponent, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
