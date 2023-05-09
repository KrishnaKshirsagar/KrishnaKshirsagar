import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementStatementComponent } from './disbursement-statement.component';

describe('DisbursementStatementComponent', () => {
  let component: DisbursementStatementComponent;
  let fixture: ComponentFixture<DisbursementStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisbursementStatementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursementStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
