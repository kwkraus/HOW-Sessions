import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsLetterComponent } from './newsletter.component';

xdescribe('NewsletterComponent', () => {
  let component: NewsLetterComponent;
  let fixture: ComponentFixture<NewsLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
