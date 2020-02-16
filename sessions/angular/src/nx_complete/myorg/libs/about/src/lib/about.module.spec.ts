import { async, TestBed } from '@angular/core/testing';
import { AboutModule } from './about.module';

describe('AboutModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AboutModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(AboutModule).toBeDefined();
  });
});
