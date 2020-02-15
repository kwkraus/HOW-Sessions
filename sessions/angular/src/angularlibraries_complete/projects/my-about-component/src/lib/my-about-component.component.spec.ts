import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAboutComponentComponent } from './my-about-component.component';

describe('MyAboutComponentComponent', () => {
  let component: MyAboutComponentComponent;
  let fixture: ComponentFixture<MyAboutComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAboutComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAboutComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
