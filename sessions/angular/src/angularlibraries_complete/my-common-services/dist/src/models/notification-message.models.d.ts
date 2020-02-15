export interface INotificationMessage {
    type: NotificationType;
    message: string;
}
export declare type NotificationType = 'success' | 'error' | 'warning' | 'info';
