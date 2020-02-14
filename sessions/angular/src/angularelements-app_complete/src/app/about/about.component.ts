import { Component, OnInit } from '@angular/core';

@Component({
   templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  pageTitle = 'About Me';
  constructor() { }

  ngOnInit() {
  }

}
