import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdalService } from 'adal-angular4';

import { NotificationService } from './core/services/notification.service';
import { AppConfig } from './app.config';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent {
  title = 'My Tiny Library App!!!';
  constructor(notificationService: NotificationService, private snackBar: MatSnackBar,
    private adalService: AdalService, private authService: AuthService) {
    notificationService.showNotification.subscribe((notification) => {
      this.showSnackBar(notification.type, notification.message);
    });
    const adalConfig: adal.Config = {
        tenant: AppConfig.settings.aad.tenant,
        clientId: AppConfig.settings.aad.clientId,
        redirectUri: window.location.origin,
        navigateToLoginRequestUrl: true,
        postLogoutRedirectUri: window.location.origin,
        endpoints: AppConfig.settings.aad.endpoints
    };
    adalService.init(adalConfig);
    this.adalService.handleWindowCallback();
  }

  showSnackBar(type: string, message: string) {
    this.snackBar.open(`${type}: ${message}`, 'DISMISS', {
      duration: 10000
    });
  }

  isLoggedIn() {
    return this.authService.isUserAuthenticated;
  }

  userName() {
    return this.authService.userName;
  }

  signIn() {
    this.authService.login();
  }

  signOut() {
    this.authService.logout();
  }
}
