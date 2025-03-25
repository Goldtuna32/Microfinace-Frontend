import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HpRegistrationListComponent } from './hp-registration-list.component';

describe('HpRegistrationListComponent', () => {
  let component: HpRegistrationListComponent;
  let fixture: ComponentFixture<HpRegistrationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HpRegistrationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HpRegistrationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
