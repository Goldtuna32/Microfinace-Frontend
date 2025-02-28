import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollateralListComponent } from './collateral-list.component';

describe('CollateralListComponent', () => {
  let component: CollateralListComponent;
  let fixture: ComponentFixture<CollateralListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollateralListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollateralListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
