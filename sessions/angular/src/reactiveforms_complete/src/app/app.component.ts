import { Component } from '@angular/core';
import { UpdateService } from './services/update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UpdateService]
})
export class AppComponent {
  title = 'My Tiny Library App!!!';
  constructor(private update: UpdateService) {}
}
