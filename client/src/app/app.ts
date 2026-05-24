import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
 
  private http = inject (HttpClient)
  protected readonly title = signal('client');


   ngOnInit(): void {
    this.http.get('https://localhost:5001/api/members').subscribe({
      next:response =>console.log(response),
      error:error => console.log(error),
      complete:() => console.log("completed the http request")
      
    })
  }
}
