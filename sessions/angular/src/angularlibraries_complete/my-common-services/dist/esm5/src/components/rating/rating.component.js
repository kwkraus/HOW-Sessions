import * as tslib_1 from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
var RatingComponent = /** @class */ (function () {
    function RatingComponent() {
        this.ratingClicked = new EventEmitter();
    }
    RatingComponent.prototype.click = function (rating) {
        this.rating = rating;
        this.ratingClicked.emit(rating);
    };
    tslib_1.__decorate([
        Input()
    ], RatingComponent.prototype, "rating", void 0);
    tslib_1.__decorate([
        Output()
    ], RatingComponent.prototype, "ratingClicked", void 0);
    RatingComponent = tslib_1.__decorate([
        Component({
            selector: 'my-rating',
            template: "<div>\r\n  <a *ngFor=\"let item of [1, 2, 3, 4, 5]\" (click)=\"click(item)\">\r\n    <i class=\"material-icons {{rating >= item ? 'active' : ''}}\">star_rate</i>\r\n  </a>\r\n</div>\r\n\r\n",
            styles: [".material-icons{cursor:pointer;color:rgba(103,58,183,.15)}.material-icons:hover{color:rgba(103,58,183,.35)}.material-icons.active{color:#000}"]
        })
    ], RatingComponent);
    return RatingComponent;
}());
export { RatingComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF0aW5nLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL215LWNvbW1vbi1zZXJ2aWNlcy8iLCJzb3VyY2VzIjpbInNyYy9jb21wb25lbnRzL3JhdGluZy9yYXRpbmcuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBT3ZFO0lBTEE7UUFRWSxrQkFBYSxHQUF5QixJQUFJLFlBQVksRUFBVSxDQUFDO0lBTTdFLENBQUM7SUFKQywrQkFBSyxHQUFMLFVBQU0sTUFBYztRQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBTlE7UUFBUixLQUFLLEVBQUU7bURBQWdCO0lBQ2Q7UUFBVCxNQUFNLEVBQUU7MERBQWtFO0lBSGhFLGVBQWU7UUFMM0IsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFdBQVc7WUFDckIseU1BQXNDOztTQUV2QyxDQUFDO09BQ1csZUFBZSxDQVMzQjtJQUFELHNCQUFDO0NBQUEsQUFURCxJQVNDO1NBVFksZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ215LXJhdGluZycsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL3JhdGluZy5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vcmF0aW5nLmNvbXBvbmVudC5jc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgUmF0aW5nQ29tcG9uZW50IHtcclxuXHJcbiAgQElucHV0KCkgcmF0aW5nOiBudW1iZXI7XHJcbiAgQE91dHB1dCgpIHJhdGluZ0NsaWNrZWQ6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XHJcblxyXG4gIGNsaWNrKHJhdGluZzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLnJhdGluZyA9IHJhdGluZztcclxuICAgIHRoaXMucmF0aW5nQ2xpY2tlZC5lbWl0KHJhdGluZyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==