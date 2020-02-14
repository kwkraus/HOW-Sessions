import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingCategory'
})
export class RatingCategoryPipe implements PipeTransform {

  transform(value: number): string {
    if (value <= 2) {
      return 'Poor';
    }
    if (value <= 4) {
      return 'Fine';
    }
    return 'Excellent';
  }
}
