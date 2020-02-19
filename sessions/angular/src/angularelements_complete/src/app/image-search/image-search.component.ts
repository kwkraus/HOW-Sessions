import { ɵdetectChanges, Input, Component, Output, EventEmitter, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { BingSearchService } from '../services/bing-search.service';

@Component({
  templateUrl: './image-search.component.html',
  styleUrls: ['./image-search.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
//   providers: [
//     BingSearchService
//   ]
})
export class ImageSearchComponent implements OnDestroy {

    private subscription: Subscription;
    imageResults: Array<{
        contentUrl: string;
        thumbnailUrl: string;
        name: string;
    }> = [];

    @Input() title = 'Search for image';
    @Input() searchstring: string;
    @Input() subscriptionkey: string;
    @Output() imageUrlSelected = new EventEmitter<string>();
    @Output() thumbnailUrlSelected = new EventEmitter<string>();

    constructor(private bingSearchService: BingSearchService) {}

    search() {
        this.subscription = this.bingSearchService.getImages(this.searchstring, this.subscriptionkey)
            .subscribe(result => {
                this.imageResults = result.map(r => {
                    return {
                        contentUrl: r.contentUrl,
                        thumbnailUrl: r.thumbnailUrl,
                        name: r.name
                    };
                });
            });

        // // Calling change detection for
        // // zone-less change detection
        // ɵdetectChanges(this);
    }

    select(index: number) {
        this.imageUrlSelected.emit(this.imageResults[index].contentUrl);
        this.thumbnailUrlSelected.emit(this.imageResults[index].thumbnailUrl);
        this.imageResults = [];
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
