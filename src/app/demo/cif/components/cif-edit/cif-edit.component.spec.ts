import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CifEditComponent } from './cif-edit.component';

describe('CifEditComponent', () => {
  let component: CifEditComponent;
  let fixture: ComponentFixture<CifEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CifEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CifEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
