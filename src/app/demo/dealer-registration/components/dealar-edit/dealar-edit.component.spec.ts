import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealarEditComponent } from './dealar-edit.component';

describe('DealarEditComponent', () => {
  let component: DealarEditComponent;
  let fixture: ComponentFixture<DealarEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealarEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealarEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
