import { TestBed } from '@angular/core/testing';

import { CollateralTypeService } from './collateral-type.service';

describe('CollateralTypeService', () => {
  let service: CollateralTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollateralTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
