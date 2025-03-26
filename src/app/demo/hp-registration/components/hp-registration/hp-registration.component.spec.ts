import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HpRegistrationComponent } from './hp-registration.component';

describe('HpRegistrationComponent', () => {
  let component: HpRegistrationComponent;
  let fixture: ComponentFixture<HpRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HpRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HpRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
