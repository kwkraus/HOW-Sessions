import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SwUpdate } from '@angular/service-worker';

@Injectable()
export class UpdateService {
  constructor(private swUpdate: SwUpdate, public snackbar: MatSnackBar) {
    this.swUpdate.available.subscribe(evt => {
      console.log('update available');
      const snack = this.snackbar.open('Update Available', 'Reload', {
        duration: 15000
      });

      snack.onAction().subscribe(() => {
        window.location.reload();
      });
    });
  }
}
