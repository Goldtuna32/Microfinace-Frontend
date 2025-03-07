import { TestBed } from '@angular/core/testing';
import { DealerRegistrationService } from './dealer-registration.service';


describe('DealerRegistrationService', () => {
  let service: DealerRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DealerRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
