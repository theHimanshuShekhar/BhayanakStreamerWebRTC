import { TestBed } from '@angular/core/testing';

import { LogingaurdService } from './logingaurd.service';

describe('LogingaurdService', () => {
  let service: LogingaurdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogingaurdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
