import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { AppConfig } from '../app.config';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthService) {
    }

    canActivate(): boolean {
        if (!AppConfig.settings.aad.requireAuth || this.authService.isUserAuthenticated) {
            return true;
        }
        this.authService.login();
        return false;
    }
}
