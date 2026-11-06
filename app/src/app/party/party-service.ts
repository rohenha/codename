import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Party } from './party.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PartyService {
  httpClient = inject(HttpClient)

  store(payload: { name: string, themes: string[] }) {
    const baseUrl = environment.apiUrl
    return this.httpClient.post<{ party: Party}>(`${baseUrl}party`, payload).pipe(map(( response) => {
      return response.party
    }))
  }

  getParty(id: string) {
    const baseUrl = environment.apiUrl
    return this.httpClient.get<Party>(`${baseUrl}party/${id}`)
  }
}
