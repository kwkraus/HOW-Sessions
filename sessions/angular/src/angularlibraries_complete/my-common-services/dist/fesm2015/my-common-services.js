import { __decorate } from 'tslib';
import { EventEmitter, Input, Output, Component, ɵɵdefineInjectable, Injectable, NgModule } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

let RatingComponent = class RatingComponent {
    constructor() {
        this.ratingClicked = new EventEmitter();
    }
    click(rating) {
        this.rating = rating;
        this.ratingClicked.emit(rating);
    }
};
__decorate([
    Input()
], RatingComponent.prototype, "rating", void 0);
__decorate([
    Output()
], RatingComponent.prototype, "ratingClicked", void 0);
RatingComponent = __decorate([
    Component({
        selector: 'my-rating',
        template: "<div>\r\n  <a *ngFor=\"let item of [1, 2, 3, 4, 5]\" (click)=\"click(item)\">\r\n    <i class=\"material-icons {{rating >= item ? 'active' : ''}}\">star_rate</i>\r\n  </a>\r\n</div>\r\n\r\n",
        styles: [".material-icons{cursor:pointer;color:rgba(103,58,183,.15)}.material-icons:hover{color:rgba(103,58,183,.35)}.material-icons.active{color:#000}"]
    })
], RatingComponent);

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
NotificationService.ngInjectableDef = ɵɵdefineInjectable({ factory: function NotificationService_Factory() { return new NotificationService(); }, token: NotificationService, providedIn: "root" });
NotificationService = __decorate([
    Injectable({ providedIn: 'root' })
], NotificationService);

let MyCommonServicesModule = class MyCommonServicesModule {
};
MyCommonServicesModule = __decorate([
    NgModule({
        imports: [
            CommonModule
        ],
        declarations: [
            RatingComponent
        ],
        exports: [
            RatingComponent
        ]
    })
], MyCommonServicesModule);

/**
 * Generated bundle index. Do not edit.
 */

export { MyCommonServicesModule, NotificationService, RatingComponent };
//# sourceMappingURL=my-common-services.js.map
