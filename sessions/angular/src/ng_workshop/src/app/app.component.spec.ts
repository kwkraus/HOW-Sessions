import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { MatTabsModule, MatToolbarModule, MatSnackBarModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { TabsComponent } from './tabs/tabs.component';

// fdescribe: focused describe
describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        AboutComponent,
        TabsComponent,
      ],
      imports: [
        MatTabsModule,
        MatToolbarModule,
        MatSnackBarModule,
        RouterTestingModule
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app component', async(() => {
    expect(component).toBeTruthy();
  }));

  it(`should have as title 'My Tiny Library App!!!'`, async(() => {
    expect(component.title).toEqual('My Tiny Library App!!!');
  }));

  it('should render about tab with title ABOUT ME', async(() => {
    const ne = fixture.debugElement.nativeElement;
    expect(ne.querySelectorAll('.mat-tab-link')[0].textContent).toContain('ABOUT ME');
  }));

  it('should render book collection tab with title MY COLLECTION', async(() => {
    const ne = fixture.debugElement.nativeElement;
    expect(ne.querySelectorAll('.mat-tab-link')[1].textContent).toContain('MY COLLECTION');
  }));

});
