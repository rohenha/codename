import { PartyUser } from '@/party/party.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpClient = inject(HttpClient)
  token = signal<string|null>(this.getToken())
  currentUser = signal<PartyUser|undefined>(undefined)

  loadCurrentUser() {
    const token = this.token()
      if (token) {
        this.getUser(token).subscribe({
          next: (user) => {
            this.currentUser.set(user)
          },
          error: () => {
            this.currentUser.set(undefined)
          }
        })
      }
  }

  storeToken(token: string) {
    localStorage.setItem('token', token)
    this.token.set(token)
  }

  getToken() {
    const token = localStorage.getItem('token')
    console.log(token)
    return token
  }

  getUser(token: string) {
    const baseUrl = environment.apiUrl
    return this.httpClient.get<PartyUser>(`${baseUrl}me`)
  }
}
