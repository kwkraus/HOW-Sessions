import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HideIfUnauthorizedDirective } from './directives/hide-if-unauthorized.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    HideIfUnauthorizedDirective
  ],
  exports: [
    CommonModule,
    HideIfUnauthorizedDirective
  ]
})
export class SharedModule { }
