import { TestBed } from '@angular/core/testing';

import { RepaymentScheduleService } from './repayment-schedule.service';

describe('RepaymentScheduleService', () => {
  let service: RepaymentScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepaymentScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
