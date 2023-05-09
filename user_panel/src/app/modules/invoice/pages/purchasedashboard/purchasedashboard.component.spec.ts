import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PurchasedashboardComponent } from "./purchasedashboard.component";

describe("BuyerComponent", () => {
  let component: PurchasedashboardComponent;
  let fixture: ComponentFixture<PurchasedashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchasedashboardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasedashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
