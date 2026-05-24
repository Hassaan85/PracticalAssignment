import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, pipe } from 'rxjs';
import { ToastService } from '../_services/toast-service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService)
  const router = inject(Router)
  return next(req).pipe(
    catchError(error => {
      if (error) {
        switch (error.status) {
          case 400 : 
          toast.error(error.error);
          break
          case 401 :
          toast.error('unauthorized');
          break;
          case 404:
            toast.error('Not Found');
          break
          case 500:
            toast.error('Server error')
          break
          default:
          toast.error('Something went wrong ')
        }
      }
      throw error;
    })
  );
};
