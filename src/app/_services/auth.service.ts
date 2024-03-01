import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LogInData, User } from '../_models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private username: string | undefined;
    private authStatusListener = new Subject<boolean>();
    private roleListener = new Subject<boolean>();
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getId() : string {
        return localStorage.getItem('id') || '';
    }

    getUsers() {
        return this.http.get<User[]>(this.baseUrl + 'auth');
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }
    getAuthStatus(): boolean {
        return localStorage.getItem('token') !== null;
    }
    getRoleListener() {
        return this.roleListener.asObservable();
    }
    getRole(): boolean {
        return localStorage.getItem('role')?.toString()?.includes('admin') || false;
    }
    getUsername(): string {
        return localStorage.getItem('username')?.toString() as string;
    }

    createUser(username: String, name: String, email: String, password: String): Observable<any> {
        const signUpData = {
            username: username,
            password: password,
            name: name,
            email: email,
        };
        return this.http.post(this.baseUrl + '/auth/register', signUpData)
    };

    updateUser(id: string, user: User): Observable<User> {
        return this.http.put<User>(this.baseUrl + '/auth/' + id, user);
    }

    disableUser(id: string): Observable<any> {
        return this.http.delete(this.baseUrl + '/auth/' + id);
    }

    logOut() {
        this.username = '';
        this.authStatusListener.next(false);
        this.roleListener.next(false);
        localStorage.clear();
    }

    logInUser(username: String, password: String): Observable<boolean> {
        const logInData: LogInData = {
          username: username,
          password: password
        };
      
        return this.http.post<User>(this.baseUrl + '/auth/login', logInData)
          .pipe(
            tap(response => {
              console.log(response);
              const username = response.username;
              this.username = username.toString();
              localStorage.setItem('username', this.username);
              localStorage.setItem('id', response.id);
              localStorage.setItem('role', response.role);
              this.authStatusListener.next(true);
              if (response.role === 'admin') {
                this.roleListener.next(true);
              }
              localStorage.setItem('token', response.accessToken.toString());
            }),
            map(response => true), // Emit true indicating successful authentication
            catchError(error => {
              console.error(error);
              return of(false); // Emit false indicating failed authentication
            })
          );
      }
      
}
