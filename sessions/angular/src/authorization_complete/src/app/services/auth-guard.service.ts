import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { AppConfig } from '../app.config';
import { ActionCode } from '../models/authorization.types';
import { AuthorizationService } from './authorization.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthService, private authorizationService: AuthorizationService) {
    }

    canActivate(route: ActivatedRouteSnapshot) {
        return this.hasRequiredPermission(route.data['actionCode']);
    }

    private hasRequiredPermission(actionCode: ActionCode) {
        if (!AppConfig.settings.aad.requireAuth || this.authService.isUserAuthenticated) {
            if (this.authorizationService.permissions) {
                if (actionCode) {
                    return this.authorizationService.hasPermission(actionCode);
                } else {
                    return this.authorizationService.hasPermission(null);
                }
            } else {
                return this.authorizationService.initializePermissions()
                    .pipe(map((actionCodes) => {
                        if (actionCodes) {
                            return this.authorizationService.hasPermission(actionCode);
                        } else {
                            return this.authorizationService.hasPermission(null);
                        }
                    }),
                    catchError(() => {
                        return of(false);
                    }));
            }
        } else {
            this.authService.login();
            return false;
        }
    }
}
