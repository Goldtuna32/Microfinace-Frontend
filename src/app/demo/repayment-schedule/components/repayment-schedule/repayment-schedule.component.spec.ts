import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepaymentScheduleComponent } from './repayment-schedule.component';

describe('RepaymentScheduleComponent', () => {
  let component: RepaymentScheduleComponent;
  let fixture: ComponentFixture<RepaymentScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepaymentScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepaymentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
