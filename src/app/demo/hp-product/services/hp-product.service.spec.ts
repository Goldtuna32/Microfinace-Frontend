import { TestBed } from '@angular/core/testing';

import { HpProductService } from './hp-product.service';

describe('HpProductService', () => {
  let service: HpProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HpProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
