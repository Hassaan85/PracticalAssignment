import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../_services/account-service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../_services/toast-service';
import { MatSnackBar } from '@angular/material/snack-bar';;

@Component({
  selector: 'app-nav',
  imports: [FormsModule ,CommonModule ],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  accountService = inject(AccountService);
  toastr = inject(ToastService)

  protected creds: any = {};

  login() {
   /// console.log(this.creds)
    this.accountService.login(this.creds).subscribe({
      next: result => {
        this.toastr.success('Logged in successfully')
        console.log('Logged in successfully', result);
      },
      error: err => {
     this.toastr.error('Invalid userName or password')
      }
    });
  }
 
  logout() {
    this.accountService.logout();
  }
}
