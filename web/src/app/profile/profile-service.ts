import { Party } from '@/party/party.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  httpClient = inject(HttpClient)
  getParties() {
    const baseUrl = environment.apiUrl
    return this.httpClient.get<{ data: { parties: Party[] } }>(`${baseUrl}account/parties`).pipe(
      map((response) => {
        return response.data.parties
      })
    )
  }
}
