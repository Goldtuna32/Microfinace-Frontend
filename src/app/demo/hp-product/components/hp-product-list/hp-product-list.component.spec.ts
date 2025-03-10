import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HpProductListComponent } from './hp-product-list.component';

describe('HpProductListComponent', () => {
  let component: HpProductListComponent;
  let fixture: ComponentFixture<HpProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HpProductListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HpProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
