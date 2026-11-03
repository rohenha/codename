import { Component, input } from '@angular/core';

@Component({
  selector: 'app-party-base',
  imports: [],
  templateUrl: './party-base.html',
  styleUrl: './party-base.css',
})
export class PartyBase {
  id = input<string>()
}
