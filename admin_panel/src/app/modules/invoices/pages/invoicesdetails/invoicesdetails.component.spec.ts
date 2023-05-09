import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InvoicesdetailsComponent } from "./invoicesdetails.component";

describe("BuyerComponent", () => {
  let component: InvoicesdetailsComponent;
  let fixture: ComponentFixture<InvoicesdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoicesdetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
