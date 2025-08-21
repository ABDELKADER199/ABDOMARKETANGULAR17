import { response } from 'express';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
// import { Console } from 'node:console';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  register(arg0: any) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://192.168.1.8:8080/api';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      map((response) => {
        if (response && response.token) {
          this.setToken(response.token);
        }
        return response;
      })
    );

  }

  getCurrentUser(): Observable<any> {
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return this.http.get<any>(`${this.apiUrl}/users`, { headers });
  }


  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }

  logout(): void {
    this.removeToken();
  }

  private setToken(token: string): void {
    sessionStorage.setItem('token', token);
    console.log('Token stored in localStorage:', token);
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('token');
    }
    return null;
  }

  private removeToken(): void {
    sessionStorage.removeItem('token');
  }

  loginWithFace(faceData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login/face`, faceData);
  }

}
