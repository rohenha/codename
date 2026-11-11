import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Party } from './party.model';
import { User } from '@/auth/auth.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PartyService {
  httpClient = inject(HttpClient)

  store(payload: { name: string, themes: string[] }) {
    const baseUrl = environment.apiUrl
    return this.httpClient.post<{ data: { party: Party } }>(`${baseUrl}party`, payload).pipe(map((response) => {
      return response.data.party
    }))
  }

  getParty(id: string) {
    const baseUrl = environment.apiUrl
    return this.httpClient.get<{ data: { party: Party } }>(`${baseUrl}party/${id}`).pipe(map((response) => {
      return response.data.party
    }))
  }

  join(id: string) {
    const baseUrl = environment.apiUrl
    return this.httpClient.get<{ data: { party: Party } }>(`${baseUrl}party/${id}/join`).pipe(map((response) => {
      return response.data.party
    }))
  }

  addUser(id: string, payload : { userId: number, password: string}) {
    const baseUrl = environment.apiUrl
    return this.httpClient.post<{ User: User }>(`${baseUrl}party/${id}/add-user`, payload)
  }
}
