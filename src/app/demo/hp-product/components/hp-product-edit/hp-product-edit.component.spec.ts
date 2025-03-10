import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HpProductEditComponent } from './hp-product-edit.component';

describe('HpProductEditComponent', () => {
  let component: HpProductEditComponent;
  let fixture: ComponentFixture<HpProductEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HpProductEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HpProductEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
