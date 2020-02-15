import { TestBed } from '@angular/core/testing';

import { MyAboutComponentService } from './my-about-component.service';

describe('MyAboutComponentService', () => {
  let service: MyAboutComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyAboutComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
