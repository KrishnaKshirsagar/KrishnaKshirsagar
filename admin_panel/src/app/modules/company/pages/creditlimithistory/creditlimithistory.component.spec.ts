import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditlimithistoryComponent } from './creditlimithistory.component';

describe('CreditlimithistoryComponent', () => {
  let component: CreditlimithistoryComponent;
  let fixture: ComponentFixture<CreditlimithistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditlimithistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditlimithistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
