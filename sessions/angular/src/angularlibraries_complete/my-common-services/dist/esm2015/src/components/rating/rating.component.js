import * as tslib_1 from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
let RatingComponent = class RatingComponent {
    constructor() {
        this.ratingClicked = new EventEmitter();
    }
    click(rating) {
        this.rating = rating;
        this.ratingClicked.emit(rating);
    }
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
export { RatingComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF0aW5nLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL215LWNvbW1vbi1zZXJ2aWNlcy8iLCJzb3VyY2VzIjpbInNyYy9jb21wb25lbnRzL3JhdGluZy9yYXRpbmcuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBT3ZFLElBQWEsZUFBZSxHQUE1QixNQUFhLGVBQWU7SUFMNUI7UUFRWSxrQkFBYSxHQUF5QixJQUFJLFlBQVksRUFBVSxDQUFDO0lBTTdFLENBQUM7SUFKQyxLQUFLLENBQUMsTUFBYztRQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQyxDQUFDO0NBQ0YsQ0FBQTtBQVBVO0lBQVIsS0FBSyxFQUFFOytDQUFnQjtBQUNkO0lBQVQsTUFBTSxFQUFFO3NEQUFrRTtBQUhoRSxlQUFlO0lBTDNCLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxXQUFXO1FBQ3JCLHlNQUFzQzs7S0FFdkMsQ0FBQztHQUNXLGVBQWUsQ0FTM0I7U0FUWSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbXktcmF0aW5nJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vcmF0aW5nLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9yYXRpbmcuY29tcG9uZW50LmNzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBSYXRpbmdDb21wb25lbnQge1xyXG5cclxuICBASW5wdXQoKSByYXRpbmc6IG51bWJlcjtcclxuICBAT3V0cHV0KCkgcmF0aW5nQ2xpY2tlZDogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcclxuXHJcbiAgY2xpY2socmF0aW5nOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMucmF0aW5nID0gcmF0aW5nO1xyXG4gICAgdGhpcy5yYXRpbmdDbGlja2VkLmVtaXQocmF0aW5nKTtcclxuICB9XHJcbn1cclxuIl19