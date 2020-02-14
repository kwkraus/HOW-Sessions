import { ImageSearchComponent } from './image-search.component';
import { ɵrenderComponent, ɵdetectChanges } from '@angular/core';

export class ImageSearchElement extends HTMLElement {
    private comp: ImageSearchComponent;

    constructor() {
        super();
        this.comp = ɵrenderComponent(ImageSearchComponent, { host: this });
        this.comp.imageUrlSelected.subscribe((eventInfo: string) =>
            this.dispatchEvent(new CustomEvent('image-url-results', { detail: eventInfo })));
        this.comp.thumbnailUrlSelected.subscribe((eventInfo: string) =>
            this.dispatchEvent(new CustomEvent('thumbnail-url-results', { detail: eventInfo })));
    }

    get searchstring(): string {
        return this.comp.searchstring;
    }

    set searchstring(searchstring: string) {
        this.comp.searchstring = searchstring;
        ɵdetectChanges(this.comp);
    }

    get subscriptionkey(): string {
        return this.comp.subscriptionkey;
    }

    set subscriptionkey(key: string) {
        this.comp.subscriptionkey = key;
        ɵdetectChanges(this.comp);
    }
}
