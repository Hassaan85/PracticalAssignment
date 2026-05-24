import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, UserTask } from '../../services/task-service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {
  private taskService = inject(TaskService);
  
  tasks = signal<UserTask[]>([]);
  newTask: any = { title: '', description: '' };
  editingTask: UserTask | null = null;
  editForm: any = { title: '', description: '', isCompleted: false };

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (data) => this.tasks.set(data),
      error: (err) => console.error('Failed to load tasks', err)
    });
  }

  addTask() {
    if (!this.newTask.title) return;
    this.taskService.createTask(this.newTask).subscribe({
      next: (task) => {
        this.tasks.update(tasks => [...tasks, task]);
        this.newTask = { title: '', description: '' };
      },
      error: (err) => console.error('Failed to create task', err)
    });
  }

  editTask(task: UserTask) {
    this.editingTask = task;
    this.editForm = { ...task };
  }

  cancelEdit() {
    this.editingTask = null;
  }

  updateTask() {
    if (!this.editingTask) return;
    this.taskService.updateTask(this.editingTask.id, this.editForm).subscribe({
      next: () => {
        this.tasks.update(tasks => tasks.map(t => t.id === this.editingTask!.id ? { ...t, ...this.editForm } : t));
        this.editingTask = null;
      },
      error: (err) => console.error('Failed to update task', err)
    });
  }

  toggleComplete(task: UserTask) {
    const updatedTask = { ...task, isCompleted: !task.isCompleted };
    this.taskService.updateTask(task.id, updatedTask).subscribe({
      next: () => {
        this.tasks.update(tasks => tasks.map(t => t.id === task.id ? updatedTask : t));
      },
      error: (err) => console.error('Failed to update task completion', err)
    });
  }

  deleteTask(id: number) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks.update(tasks => tasks.filter(t => t.id !== id));
      },
      error: (err) => console.error('Failed to delete task', err)
    });
  }
}
