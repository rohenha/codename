import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Party, PartyUser } from './party.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PartyService {
  httpClient = inject(HttpClient)

  store(payload: { name: string, themes: string[], username: string }) {
    const baseUrl = environment.apiUrl
    return this.httpClient.post<{ party: Party, partyUser: PartyUser}>(`${baseUrl}party`, payload).pipe(map((response) => {
      return {
        party: response.party,
        partyUser: response.partyUser
      }
    }))
  }

  getParty(id: string) {
    const baseUrl = environment.apiUrl
    return this.httpClient.get<Party>(`${baseUrl}party/${id}`)
  }

  addUser(id: string, payload: { username: string}) {
    const baseUrl = environment.apiUrl
    return this.httpClient.post<{ partyUser: PartyUser }>(`${baseUrl}party/${id}/add-user`, payload).pipe(
      map((response) => response.partyUser)
    )
  }
}
