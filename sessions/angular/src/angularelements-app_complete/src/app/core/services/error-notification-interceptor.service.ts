import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable( { providedIn: 'root' })
export class ErrorNotificationInterceptor implements HttpInterceptor {
    constructor(private notificationService: NotificationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
          .pipe(
            retry(1),
            catchError((error: HttpErrorResponse) => {
                const errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                this.notificationService.triggerNotification(errorMessage, 'error');
                return throwError(error);
            })
          ) as Observable<HttpEvent<any>>;
    }
}
