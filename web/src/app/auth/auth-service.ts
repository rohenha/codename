import { User } from '@/auth/auth.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, map, Observable, of, shareReplay, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpClient = inject(HttpClient)
  currentUser = signal<User | undefined>(undefined)
  private refreshRequest?: Observable<User>

  /**
   * Loads the current player from the HttpOnly access cookie.
   *
   * The auth interceptor transparently calls /auth/refresh when the access
   * cookie has expired and a refresh cookie is still valid.
   */
  loadCurrentUser(): Observable<User | undefined> {
    const baseUrl = environment.apiUrl
    return this.httpClient.get<{ data: User }>(`${baseUrl}account/profile`).pipe(
      map((response) => {
        return response.data
      }),
      tap((user) => this.currentUser.set(user)),
      catchError(() => {
        this.currentUser.set(undefined)
        return of(undefined)
      })
    )
  }

  signup(payload: { username: string, password: string }): Observable<User | undefined> {
    const baseUrl = environment.apiUrl
    return this.httpClient.post<{ data: { user: User } }>(`${baseUrl}auth/signup`, payload).pipe(
      map((response) => {
        return response.data.user
      }),
      tap((user) => {
        this.currentUser.set(user)
      })
    )
  }

  login(payload: { username: string, password: string }): Observable<User | undefined> {
    const baseUrl = environment.apiUrl
    return this.httpClient.post<{ data: { user: User } }>(`${baseUrl}auth/login`, payload).pipe(
      map((response) => {
        return response.data.user
      }),
      tap((user) => {
        this.currentUser.set(user)
      })
    )
  }

  /**
   * Rotates the refresh token and receives a new access cookie.
   *
   * Concurrent 401 responses share the same refresh request.
   */
  refresh(): Observable<User> {
    if (!this.refreshRequest) {
      const baseUrl = environment.apiUrl
      this.refreshRequest = this.httpClient.post<User>(`${baseUrl}auth/refresh`, {}).pipe(
        tap((user) => this.currentUser.set(user)),
        finalize(() => {
          this.refreshRequest = undefined
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      )
    }

    return this.refreshRequest
  }

  logout(): Observable<void> {
    const baseUrl = environment.apiUrl
    return this.httpClient.post<void>(`${baseUrl}account/logout`, {}).pipe(
      tap(() => this.currentUser.set(undefined))
    )
  }
}
