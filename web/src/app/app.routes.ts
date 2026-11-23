import { Routes } from '@angular/router';
import { authGuardGuard } from '@/auth/auth-guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('@/landing/landing').then((m) => m.Landing) },
  { path: 'auth/signup', loadComponent: () => import('@/auth/signup-form/signup-form').then((m) => m.SignUpForm) },
  { path: 'auth/login', loadComponent: () => import('@/auth/signin-form/signin-form').then((m) => m.SignInForm) },
  { path: 'party/create', loadComponent: () => import('@/party/create-form/create-form').then((m) => m.CreateForm) },
  { path: 'party/:partyId/join', loadComponent: () => import('@/party/join-user/join-user').then((m) => m.JoinUser) },
  { path: 'party/:partyId', loadComponent: () => import('@/party/party-dashboard/party-dashboard').then((m) => m.PartyDashboard), canActivate: [authGuardGuard] },
  { path: 'party/:partyId/admin/teams', loadComponent: () => import('@/party/party-teams/party-teams').then((m) => m.PartyTeams), canActivate: [authGuardGuard] },
  { path: 'party/:partyId/teams', loadComponent: () => import('@/party/party-teams/party-teams').then((m) => m.PartyTeams), canActivate: [authGuardGuard] },
];
