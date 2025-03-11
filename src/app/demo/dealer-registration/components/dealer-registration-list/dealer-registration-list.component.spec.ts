import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerRegistrationListComponent } from './dealer-registration-list.component';

describe('DealerRegistrationListComponent', () => {
  let component: DealerRegistrationListComponent;
  let fixture: ComponentFixture<DealerRegistrationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealerRegistrationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerRegistrationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
