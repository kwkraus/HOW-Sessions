export interface INotificationMessage {
    type: NotificationType;
    message: string;
}

export type NotificationType =
    'success' | 'error' | 'warning' | 'info';

