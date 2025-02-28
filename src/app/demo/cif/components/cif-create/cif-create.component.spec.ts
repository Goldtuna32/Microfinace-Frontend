import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CifCreateComponent } from './cif-create.component';

describe('CifCreateComponent', () => {
  let component: CifCreateComponent;
  let fixture: ComponentFixture<CifCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CifCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CifCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
