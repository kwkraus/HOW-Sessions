import { Injectable } from '@angular/core';
import { ActionCode } from '../models/authorization.types';
import { AuthorizationDataService } from './authorization-data.service';
import { AppConfig } from '../app.config';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {

    permissions: Array<ActionCode>; // The actions for which this user has permissions

    constructor(private authorizationDataService: AuthorizationDataService) {
    }

    hasPermission(action: ActionCode) {
        if (!AppConfig.settings.aad.requireAuth || !action) {
            return true;
        }
        if (this.permissions && this.permissions.find(permission => {
                return permission === action;
            })) {
            return true;
        }
        return false;
    }

    initializePermissions() {
        return this.authorizationDataService.getPermissions()
        .pipe(tap((permissions: Array<ActionCode>) => {
            this.permissions = permissions;
        }));
    }
}
