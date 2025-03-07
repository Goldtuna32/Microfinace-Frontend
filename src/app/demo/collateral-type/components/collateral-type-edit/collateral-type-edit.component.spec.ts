import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollateralTypeEditComponent } from './collateral-type-edit.component';

describe('CollateralTypeEditComponent', () => {
  let component: CollateralTypeEditComponent;
  let fixture: ComponentFixture<CollateralTypeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollateralTypeEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollateralTypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
