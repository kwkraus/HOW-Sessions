import { NgModule } from '@angular/core';
import { RatingComponent } from './components/rating/rating.component';
import { CommonModule } from '@angular/common';

@NgModule({
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
export class MyCommonServicesModule { }
