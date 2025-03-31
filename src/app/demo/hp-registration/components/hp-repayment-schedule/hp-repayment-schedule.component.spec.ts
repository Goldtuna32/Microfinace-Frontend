import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HpRepaymentScheduleComponent } from './hp-repayment-schedule.component';

describe('HpRepaymentScheduleComponent', () => {
  let component: HpRepaymentScheduleComponent;
  let fixture: ComponentFixture<HpRepaymentScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HpRepaymentScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HpRepaymentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
