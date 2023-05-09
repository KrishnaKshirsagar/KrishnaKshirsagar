import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivablesAgeingByInvoiceComponent } from './receivables-ageing-by-invoice.component';

describe('ReceivablesAgeingByInvoiceComponent', () => {
  let component: ReceivablesAgeingByInvoiceComponent;
  let fixture: ComponentFixture<ReceivablesAgeingByInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivablesAgeingByInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivablesAgeingByInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
