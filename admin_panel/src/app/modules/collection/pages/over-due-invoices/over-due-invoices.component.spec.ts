import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OverDueInvoicesComponent } from "./over-due-invoices.component";

describe("BuyerComponent", () => {
  let component: OverDueInvoicesComponent;
  let fixture: ComponentFixture<OverDueInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OverDueInvoicesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverDueInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
