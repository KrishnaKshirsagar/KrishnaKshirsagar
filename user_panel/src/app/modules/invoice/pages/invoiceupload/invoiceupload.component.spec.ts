import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InvoiceuploadComponent } from "./invoiceupload.component";

describe("BuyerComponent", () => {
  let component: InvoiceuploadComponent;
  let fixture: ComponentFixture<InvoiceuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceuploadComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
