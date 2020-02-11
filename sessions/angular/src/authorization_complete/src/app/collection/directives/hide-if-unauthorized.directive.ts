import { OnInit } from '@angular/core';
import { Directive, ElementRef, Input } from '@angular/core';
import { ActionCode } from '../../models/authorization.types';
import { AuthorizationService } from '../../services/authorization.service';

@Directive({
    selector: '[appHideIfUnauthorized]'
})
export class HideIfUnauthorizedDirective implements OnInit {
    @Input('appHideIfUnauthorized') permission: ActionCode;

    constructor(private el: ElementRef, private authorizationService: AuthorizationService) {
    }

    ngOnInit() {
        if (!this.authorizationService.hasPermission(this.permission)) {
            this.el.nativeElement.style.display = 'none';
        }
    }
}
