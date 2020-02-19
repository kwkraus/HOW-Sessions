# Http Interceptors
We'll create an interceptor that captures every http request and if there is an error, it uses a custom service to emit an observable that components can subscribe to and show a notification message.

## Step 1 - Create the Notification Service

### models/notification-message.models.ts

```javascript
export interface INotificationMessage {
    type: NotificationType;
    message: string;
}

export type NotificationType =
    'success' | 'error' | 'warning' | 'info';

```

### services/notification.service.ts

```javascript
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { INotificationMessage, NotificationType } from '../models/notification-message.models';

@Injectable({ providedIn: 'root'})
export class NotificationService {
    private showNotificationSource = new Subject<INotificationMessage>();
    showNotification = this.showNotificationSource.asObservable();

    triggerNotification(message: string, type: NotificationType = 'info') {
        const notification: INotificationMessage = {
            message: message,
            type: type
        };
        this.showNotificationSource.next(notification);
    }
}
```

## Step 2 - Create the Http Interceptor

### error-notification-interceptor.service.ts

```javascript
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

```
## Step 3 - Specify the interceptor in the app module

### app.module.ts

```javascript
providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorNotificationInterceptor, multi: true }
```
## Step 4 - Modify the app component to show the error message

### app.component.ts

```javascript
  constructor(notificationService: NotificationService, private snackBar: MatSnackBar) {
    notificationService.showNotification.subscribe((notification) => {
      this.showSnackBar(notification.type, notification.message);
    });
  }

  showSnackBar(type: string, message: string) {
    this.snackBar.open(`${type}: ${message}`, 'DISMISS', {
      duration: 10000
    });
  }
```
## Step 5 - Test it

### data.service.ts
Add some text to make the url invalid

```javascript
  getBook(id: number): Observable<IBook> {
    return this._http.get<IBook>(`${this._booksUrl}-broken/${id.toString()}`)
      .pipe(
        catchError(this.handleError)
      );
  }
```
Run and try to navigate to a book detail and you should see the alert popup at the bottom of the screen.