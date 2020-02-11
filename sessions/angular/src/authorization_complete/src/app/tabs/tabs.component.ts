import { Component } from '@angular/core';
import { INavlink } from './inavlink';
import { AuthorizationService } from '../services/authorization.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent {

  constructor(private authorizationService: AuthorizationService) {
  }

  navLinks: Array<INavlink> = [
    {
      path: 'about',
      label: 'ABOUT ME'
    },
    {
      path: 'collection',
      label: 'MY COLLECTION'
    },
    {
      path: 'newsletter',
      label: 'SURPRISE ME',
      disabled: !this.authorizationService.hasPermission('ADMIN')
    }
  ];
}
