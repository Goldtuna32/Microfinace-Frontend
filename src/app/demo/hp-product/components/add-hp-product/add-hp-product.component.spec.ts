import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHpProductComponent } from './add-hp-product.component';

describe('AddHpProductComponent', () => {
  let component: AddHpProductComponent;
  let fixture: ComponentFixture<AddHpProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHpProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHpProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
