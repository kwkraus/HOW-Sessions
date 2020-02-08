import { Component } from '@angular/core';
import { UpdateService } from './services/update.service';
import { MatSnackBar } from '@angular/material';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UpdateService]
})
export class AppComponent {
  title = 'My Tiny Library App!!!';
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
}
