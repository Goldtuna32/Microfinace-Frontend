import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HpRegistrationDetailComponent } from './hp-registration-detail.component';

describe('HpRegistrationDetailComponent', () => {
  let component: HpRegistrationDetailComponent;
  let fixture: ComponentFixture<HpRegistrationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HpRegistrationDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HpRegistrationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
