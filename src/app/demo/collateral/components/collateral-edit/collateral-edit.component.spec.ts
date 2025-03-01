import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollateralEditComponent } from './collateral-edit.component';

describe('CollateralEditComponent', () => {
  let component: CollateralEditComponent;
  let fixture: ComponentFixture<CollateralEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollateralEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollateralEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
