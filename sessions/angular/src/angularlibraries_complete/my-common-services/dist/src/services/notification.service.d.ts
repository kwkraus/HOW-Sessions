import { INotificationMessage, NotificationType } from '../models/notification-message.models';
export declare class NotificationService {
    private showNotificationSource;
    showNotification: import("rxjs").Observable<INotificationMessage>;
    triggerNotification(message: string, type?: NotificationType): void;
}
