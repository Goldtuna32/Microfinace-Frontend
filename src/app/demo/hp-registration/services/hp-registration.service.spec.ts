import { TestBed } from '@angular/core/testing';

import { HpRegistrationService } from './hp-registration.service';

describe('HpRegistrationService', () => {
  let service: HpRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HpRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
