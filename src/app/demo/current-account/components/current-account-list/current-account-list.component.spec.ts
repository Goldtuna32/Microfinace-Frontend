import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentAccountListComponent } from './current-account-list.component';

describe('CurrentAccountListComponent', () => {
  let component: CurrentAccountListComponent;
  let fixture: ComponentFixture<CurrentAccountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentAccountListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
