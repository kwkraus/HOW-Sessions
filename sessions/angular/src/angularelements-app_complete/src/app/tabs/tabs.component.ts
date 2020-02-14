import { Component } from '@angular/core';
import { INavlink } from './inavlink';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent {

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
      label: 'SURPRISE ME'
    }
  ];
}
