import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
var NotificationService = /** @class */ (function () {
    function NotificationService() {
        this.showNotificationSource = new Subject();
        this.showNotification = this.showNotificationSource.asObservable();
    }
    NotificationService.prototype.triggerNotification = function (message, type) {
        if (type === void 0) { type = 'info'; }
        var notification = {
            message: message,
            type: type
        };
        this.showNotificationSource.next(notification);
    };
    NotificationService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function NotificationService_Factory() { return new NotificationService(); }, token: NotificationService, providedIn: "root" });
    NotificationService = tslib_1.__decorate([
        Injectable({ providedIn: 'root' })
    ], NotificationService);
    return NotificationService;
}());
export { NotificationService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9teS1jb21tb24tc2VydmljZXMvIiwic291cmNlcyI6WyJzcmMvc2VydmljZXMvbm90aWZpY2F0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQzs7QUFJL0I7SUFEQTtRQUVZLDJCQUFzQixHQUFHLElBQUksT0FBTyxFQUF3QixDQUFDO1FBQ3JFLHFCQUFnQixHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztLQVNqRTtJQVBHLGlEQUFtQixHQUFuQixVQUFvQixPQUFlLEVBQUUsSUFBK0I7UUFBL0IscUJBQUEsRUFBQSxhQUErQjtRQUNoRSxJQUFNLFlBQVksR0FBeUI7WUFDdkMsT0FBTyxFQUFFLE9BQU87WUFDaEIsSUFBSSxFQUFFLElBQUk7U0FDYixDQUFDO1FBQ0YsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNuRCxDQUFDOztJQVZRLG1CQUFtQjtRQUQvQixVQUFVLENBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFDLENBQUM7T0FDckIsbUJBQW1CLENBVy9COzhCQWhCRDtDQWdCQyxBQVhELElBV0M7U0FYWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgSU5vdGlmaWNhdGlvbk1lc3NhZ2UsIE5vdGlmaWNhdGlvblR5cGUgfSBmcm9tICcuLi9tb2RlbHMvbm90aWZpY2F0aW9uLW1lc3NhZ2UubW9kZWxzJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnfSlcclxuZXhwb3J0IGNsYXNzIE5vdGlmaWNhdGlvblNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBzaG93Tm90aWZpY2F0aW9uU291cmNlID0gbmV3IFN1YmplY3Q8SU5vdGlmaWNhdGlvbk1lc3NhZ2U+KCk7XHJcbiAgICBzaG93Tm90aWZpY2F0aW9uID0gdGhpcy5zaG93Tm90aWZpY2F0aW9uU291cmNlLmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICAgIHRyaWdnZXJOb3RpZmljYXRpb24obWVzc2FnZTogc3RyaW5nLCB0eXBlOiBOb3RpZmljYXRpb25UeXBlID0gJ2luZm8nKSB7XHJcbiAgICAgICAgY29uc3Qgbm90aWZpY2F0aW9uOiBJTm90aWZpY2F0aW9uTWVzc2FnZSA9IHtcclxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcclxuICAgICAgICAgICAgdHlwZTogdHlwZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5zaG93Tm90aWZpY2F0aW9uU291cmNlLm5leHQobm90aWZpY2F0aW9uKTtcclxuICAgIH1cclxufVxyXG4iXX0=