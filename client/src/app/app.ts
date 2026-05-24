import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { Nav } from "./nav/nav";
import { TasksComponent } from './tasks/tasks.component';
import { AccountService } from '../services/account-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, TasksComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
 
  private http = inject(HttpClient);
  accountService = inject(AccountService);
  protected readonly title = signal('client');

  ngOnInit(): void {
    // Keep the existing http request if needed
    this.http.get('https://localhost:5001/api/members').subscribe({
      next: response => console.log(response),
      error: error => console.log(error),
      complete: () => console.log("completed the http request")
    });
  }
}
