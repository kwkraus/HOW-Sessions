import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
let NotificationService = class NotificationService {
    constructor() {
        this.showNotificationSource = new Subject();
        this.showNotification = this.showNotificationSource.asObservable();
    }
    triggerNotification(message, type = 'info') {
        const notification = {
            message: message,
            type: type
        };
        this.showNotificationSource.next(notification);
    }
};
NotificationService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function NotificationService_Factory() { return new NotificationService(); }, token: NotificationService, providedIn: "root" });
NotificationService = tslib_1.__decorate([
    Injectable({ providedIn: 'root' })
], NotificationService);
export { NotificationService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9teS1jb21tb24tc2VydmljZXMvIiwic291cmNlcyI6WyJzcmMvc2VydmljZXMvbm90aWZpY2F0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQzs7QUFJL0IsSUFBYSxtQkFBbUIsR0FBaEMsTUFBYSxtQkFBbUI7SUFEaEM7UUFFWSwyQkFBc0IsR0FBRyxJQUFJLE9BQU8sRUFBd0IsQ0FBQztRQUNyRSxxQkFBZ0IsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsWUFBWSxFQUFFLENBQUM7S0FTakU7SUFQRyxtQkFBbUIsQ0FBQyxPQUFlLEVBQUUsT0FBeUIsTUFBTTtRQUNoRSxNQUFNLFlBQVksR0FBeUI7WUFDdkMsT0FBTyxFQUFFLE9BQU87WUFDaEIsSUFBSSxFQUFFLElBQUk7U0FDYixDQUFDO1FBQ0YsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNuRCxDQUFDO0NBQ0osQ0FBQTs7QUFYWSxtQkFBbUI7SUFEL0IsVUFBVSxDQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBQyxDQUFDO0dBQ3JCLG1CQUFtQixDQVcvQjtTQVhZLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBJTm90aWZpY2F0aW9uTWVzc2FnZSwgTm90aWZpY2F0aW9uVHlwZSB9IGZyb20gJy4uL21vZGVscy9ub3RpZmljYXRpb24tbWVzc2FnZS5tb2RlbHMnO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCd9KVxyXG5leHBvcnQgY2xhc3MgTm90aWZpY2F0aW9uU2VydmljZSB7XHJcbiAgICBwcml2YXRlIHNob3dOb3RpZmljYXRpb25Tb3VyY2UgPSBuZXcgU3ViamVjdDxJTm90aWZpY2F0aW9uTWVzc2FnZT4oKTtcclxuICAgIHNob3dOb3RpZmljYXRpb24gPSB0aGlzLnNob3dOb3RpZmljYXRpb25Tb3VyY2UuYXNPYnNlcnZhYmxlKCk7XHJcblxyXG4gICAgdHJpZ2dlck5vdGlmaWNhdGlvbihtZXNzYWdlOiBzdHJpbmcsIHR5cGU6IE5vdGlmaWNhdGlvblR5cGUgPSAnaW5mbycpIHtcclxuICAgICAgICBjb25zdCBub3RpZmljYXRpb246IElOb3RpZmljYXRpb25NZXNzYWdlID0ge1xyXG4gICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxyXG4gICAgICAgICAgICB0eXBlOiB0eXBlXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnNob3dOb3RpZmljYXRpb25Tb3VyY2UubmV4dChub3RpZmljYXRpb24pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==