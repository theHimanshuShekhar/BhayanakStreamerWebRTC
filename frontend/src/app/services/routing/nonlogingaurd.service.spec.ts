import { TestBed } from '@angular/core/testing';

import { NonlogingaurdService } from './nonlogingaurd.service';

describe('NonlogingaurdService', () => {
  let service: NonlogingaurdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NonlogingaurdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
