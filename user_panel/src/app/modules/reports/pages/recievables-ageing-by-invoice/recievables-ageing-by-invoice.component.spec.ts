import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecievablesAgeingByInvoiceComponent } from './recievables-ageing-by-invoice.component';

describe('RecievablesAgeingByInvoiceComponent', () => {
  let component: RecievablesAgeingByInvoiceComponent;
  let fixture: ComponentFixture<RecievablesAgeingByInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecievablesAgeingByInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecievablesAgeingByInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
