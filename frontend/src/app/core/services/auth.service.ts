import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { User, UserRole } from '../models/user.model';
import { AuthState, LoginCredentials, RegisterData } from '../models/auth.model';
import { ApiService } from '../../services/api.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStateSubject = new BehaviorSubject<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(
    private storage: StorageService,
    private apiService: ApiService,
    private cookieService: CookieService
  ) {
    this.loadAuthState();
  }

  private loadAuthState(): void {
    const token = this.cookieService.get('auth_token');
    const user = this.storage.getItem<User>('user');

    if (token && user) {
      this.authStateSubject.next({
        user,
        token,
        isAuthenticated: true
      });
    }
  }

  login(credentials: LoginCredentials): Observable<AuthState> {
    const payload = {
      contact_info: credentials.email, // Backend expects contact_info
      password: credentials.password
    };

    return from(this.apiService.post('api/auth/v1/login', payload)).pipe(
      map(response => {
        const { token, user } = response.data;

        const authState: AuthState = {
          user,
          token,
          isAuthenticated: true
        };

        this.cookieService.set('auth_token', token, undefined, '/');
        this.storage.setItem('user', user);
        this.authStateSubject.next(authState);

        return authState;
      }),
      catchError(error => {
        return throwError(() => new Error(error.response?.data?.message || 'Login failed'));
      })
    );
  }

  register(data: RegisterData): Observable<User> {
    const payload = {
      name: data.name,
      contact_info: data.email, // Backend expects contact_info
      password: data.password,
      role: data.role
    };

    return from(this.apiService.post('api/auth/v1/register', payload)).pipe(
      map(response => {
        // Backend doesn't return the user on register, but success.
        return {
          id: 'temp',
          name: data.name,
          email: data.email,
          role: data.role,
          createdAt: new Date()
        } as User;
      }),
      catchError(error => {
        return throwError(() => new Error(error.response?.data?.message || 'Registration failed'));
      })
    );
  }

  logout(): void {
    this.cookieService.delete('auth_token', '/');
    this.storage.removeItem('user');
    this.authStateSubject.next({
      user: null,
      token: null,
      isAuthenticated: false
    });
  }

  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
}
