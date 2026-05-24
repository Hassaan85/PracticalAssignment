import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [FormsModule ,CommonModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  accountService = inject(AccountService);

  protected creds: any = {};

  login() {
    console.log(this.creds)
    this.accountService.login(this.creds).subscribe({
      next: result => {
        console.log('Logged in successfully', result);
      },
      error: err => {
        console.log(err);
      }
    });
  }
 
  logout() {
    this.accountService.logout();
  }
}
