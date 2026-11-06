import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./landing/landing').then((m) => m.Landing) },
  { path: 'create', loadComponent: () => import('./generator/create-form/create-form').then((m) => m.CreateForm) },
  { path: 'join', loadComponent: () => import('./generator/join-form/join-form').then((m) => m.JoinForm) },
  { path: 'party/:partyId', loadComponent: () => import('./party/party-base/party-base').then((m) => m.PartyBase) },
];
