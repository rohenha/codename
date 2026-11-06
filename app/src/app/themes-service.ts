import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { ThemeOption } from './themes.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemesService {
  httpClient = inject(HttpClient)

  getOptions() {
    const baseUrl = environment.apiUrl
    return this.httpClient.get<{ data: ThemeOption[]}>(`${baseUrl}themes/options`).pipe(map(( response) => {
      return response.data
    }))
  }
}
