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
