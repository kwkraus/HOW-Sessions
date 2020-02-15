import { EventEmitter } from '@angular/core';
export declare class RatingComponent {
    rating: number;
    ratingClicked: EventEmitter<number>;
    click(rating: number): void;
}
