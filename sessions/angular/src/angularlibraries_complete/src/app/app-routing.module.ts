import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { AboutComponent } from './about/about.component';
import { NewsLetterComponent } from './newsletter/newsletter.component';
import { AuthGuardService } from './core/services/auth-guard.service';
import { MyAboutComponentComponent } from 'my-about-component';

const routes: Routes = [
  {
    path: 'about',
    component: MyAboutComponentComponent
    // component: AboutComponent
  },
  {
    path: 'collection',
    canActivate: [AuthGuardService],
    data: { actionCode: 'VIEW' },
    loadChildren: () => import('./collection/collection.module').then(m => m.CollectionModule)
  },
  {
    path: 'newsletter',
    canActivate: [AuthGuardService],
    data: { actionCode: 'ADMIN' },
    component: NewsLetterComponent
  },
  {
    path: '',
    redirectTo: '/about',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
