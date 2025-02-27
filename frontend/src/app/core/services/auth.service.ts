import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private jwtHelper = new JwtHelperService();
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private socialAuthService: SocialAuthService
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('auth_token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.currentUserSubject.next({
        id: decodedToken.sub,
        email: decodedToken.email,
        name: decodedToken.name
      });
    }
  }

  login(accessToken: string, provider: string): Observable<any> {
    console.log("accessToken", accessToken, provider);
    return this.http.post<{token: string}>(`${this.apiUrl}/login`, { token: accessToken, provider })
      .pipe(
        tap((response: any) => this.handleAuthentication(response.access_token))
      );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.currentUserSubject.next(null);
    this.socialAuthService.signOut();
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  private handleAuthentication(token: string): void {
    localStorage.setItem('auth_token', token);
    const decodedToken = this.jwtHelper.decodeToken(token);
    console.log("decodedToken", decodedToken);
    this.currentUserSubject.next({
      id: decodedToken.sub,
      email: decodedToken.email,
      name: decodedToken.name
    });
  }
}