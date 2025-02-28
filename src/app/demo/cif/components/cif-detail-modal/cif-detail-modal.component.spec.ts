import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CifDetailModalComponent } from './cif-detail-modal.component';

describe('CifDetailModalComponent', () => {
  let component: CifDetailModalComponent;
  let fixture: ComponentFixture<CifDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CifDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CifDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
