import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { UserTask } from '../_models/user-task.model';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  baseUrl = 'https://localhost:5001/api/tasks/';
    private getAuthHeaders(): HttpHeaders {
    const creds = localStorage.getItem('creds');
    console.log(creds)

    if (!creds) return new HttpHeaders();

    const { username, password } = JSON.parse(creds);

    const auth = 'Basic ' + btoa(username + ':' + password);
console.log(auth)
    return new HttpHeaders({
      Authorization: auth,
      'Content-Type': 'application/json'
    });
  }

  getTasks() {
    const userId = this.accountService.currentUser()?.id;
    return this.http.get<UserTask[]>(this.baseUrl, {
        headers: this.getAuthHeaders()
    });
  }

  createTask(task: any) {
    const userId = this.accountService.currentUser()?.id;
    return this.http.post<UserTask>(this.baseUrl + userId, task, {
        headers: this.getAuthHeaders()
    });
  }

  updateTask(id: number, task: any) {
    return this.http.put(this.baseUrl + id, task, {
        headers: this.getAuthHeaders()
    });
  }

  deleteTask(id: number) {
    return this.http.delete(this.baseUrl + id, {
        headers: this.getAuthHeaders()
    });
  }
}
