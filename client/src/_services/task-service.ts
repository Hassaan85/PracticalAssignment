import { HttpClient } from '@angular/common/http';
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

  getTasks() {
    const userId = this.accountService.currentUser()?.id;
    return this.http.get<UserTask[]>(this.baseUrl + userId);
  }

  createTask(task: any) {
    const userId = this.accountService.currentUser()?.id;
    return this.http.post<UserTask>(this.baseUrl + userId, task);
  }

  updateTask(id: number, task: any) {
    return this.http.put(this.baseUrl + id, task);
  }

  deleteTask(id: number) {
    return this.http.delete(this.baseUrl + id);
  }
}
