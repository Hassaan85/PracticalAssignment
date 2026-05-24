import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {

  private http = inject(HttpClient);
  baseUrl = 'https://localhost:5001/api/';

  currentUser = signal<any | null>(null);

  constructor() {
  const user = localStorage.getItem('user');

  if (user) {
    this.currentUser.set(JSON.parse(user));
  }
}

  login(creds: any) {
    return this.http.post(this.baseUrl + 'account/login', creds).pipe(
      map((user: any) => {
        if (user) {
          this.currentUser.set(user);
          localStorage.setItem('user' ,JSON.stringify(user));
        }
        return user;
      })
    );
  }

  setCurrentUser(user: any) {
    this.currentUser.set(user);
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('user');
  }
}
