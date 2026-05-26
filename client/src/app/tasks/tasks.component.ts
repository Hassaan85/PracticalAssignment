import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../_services/task-service';
import { UserTask } from '../../_models/user-task.model';
import { ToastService } from '../../_services/toast-service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {
  private taskService = inject(TaskService);
  private toastr = inject(ToastService)

  tasks = signal<UserTask[]>([]);
  newTask: any = { title: '', description: '' };
  editingTask: UserTask | null = null;
  editForm: any = { title: '', description: '', isCompleted: false };
  filter = signal<'all' | 'completed' | 'pending'>('all');

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (data) => this.tasks.set(data),
      error: () => this.toastr.error('Failed to load tasks')
    });
  }

  debug() {
    console.log('filter changed:', this.filter);
  }

  addTask() {
    if (!this.newTask.title || !this.newTask.description) return;
    this.taskService.createTask(this.newTask).subscribe({
      next: (task) => {
        this.tasks.update(tasks => [...tasks, task]);
        this.newTask = { title: '', description: '' };
        this.toastr.success('Task Added successfully')
      },
      error: () => {
        this.toastr.error('Error Adding Task')
      }
    });
  }

  filteredTasks = computed(() => {
    const tasks = this.tasks();
     const filter = this.filter();

    console.log(1)
    if (filter === 'completed') {
      return tasks.filter(t => t.isCompleted);
    }

    if (filter === 'pending') {
      return tasks.filter(t => !t.isCompleted);
    }

    return tasks; 
  });

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
        this.toastr.success('Task Updated Successfully')
      },
      error: () => this.toastr.error('Failed to update task')
    });
  }

  toggleComplete(task: UserTask) {
    const updatedTask = { ...task, isCompleted: !task.isCompleted };
    this.taskService.updateTask(task.id, updatedTask).subscribe({
      next: () => {
        this.tasks.update(tasks => tasks.map(t => t.id === task.id ? updatedTask : t));
        this.toastr.success('Task Completed succefully')
      },
      error: () => this.toastr.error('Failed to update task completion')
    });
  }

  deleteTask(id: number) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks.update(tasks => tasks.filter(t => t.id !== id));
        this.toastr.success('Task Deleted Successfully')
      },
      error: () => this.toastr.error('Failed to delete task')
    });
  }
}
