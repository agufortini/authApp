import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { enviroment } from 'src/enviroments/enviroments';
import { Login, User } from '../interfaces';
import { AuthStatus } from '../interfaces/authStatus.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = enviroment.baseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.cheking);

  public currentUser = computed(() => this._currentUser);
  public authStatus = computed(() => this._authStatus);


  constructor() { }

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = {email, password};

    return this.http.post<Login>(url, body)
      .pipe(
        tap(({ user, token }) => {
          this._currentUser.set(user);
          this._authStatus.set(AuthStatus.authenticated);
          localStorage.setItem('token', token);
          console.log({user, token});
        }),

        map(() => true)

        //TODO: errores
      );
  }

}
