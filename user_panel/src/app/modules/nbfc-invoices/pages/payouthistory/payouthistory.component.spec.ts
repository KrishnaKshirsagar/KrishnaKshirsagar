import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PayouthistoryComponent } from "./payouthistory.component";

describe("BuyerComponent", () => {
  let component: PayouthistoryComponent;
  let fixture: ComponentFixture<PayouthistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayouthistoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayouthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
