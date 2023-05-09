import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SellerinvoicesComponent } from "./sellerinvoices.component";

describe("BuyerComponent", () => {
  let component: SellerinvoicesComponent;
  let fixture: ComponentFixture<SellerinvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SellerinvoicesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerinvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
