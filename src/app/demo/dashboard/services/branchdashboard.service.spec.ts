import { TestBed } from '@angular/core/testing';

import { BranchdashboardService } from './branchdashboard.service';

describe('BranchdashboardService', () => {
  let service: BranchdashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BranchdashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
