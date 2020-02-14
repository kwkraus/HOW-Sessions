import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService } from './services/error-handler.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorNotificationInterceptor } from './services/error-notification-interceptor.service';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AdalService, AdalGuard } from 'adal-angular4';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    AdalService, AdalGuard,
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorNotificationInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ]
})
export class CoreModule { }
