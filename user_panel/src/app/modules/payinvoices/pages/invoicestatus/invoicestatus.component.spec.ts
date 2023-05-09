import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InvoicestatusComponent } from "./invoicestatus.component";

describe("BuyerComponent", () => {
  let component: InvoicestatusComponent;
  let fixture: ComponentFixture<InvoicestatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoicestatusComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicestatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
