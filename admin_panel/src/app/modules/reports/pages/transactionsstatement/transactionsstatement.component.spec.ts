import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TransactionsstatementComponent } from "./transactionsstatement.component";

describe("BuyerComponent", () => {
  let component: TransactionsstatementComponent;
  let fixture: ComponentFixture<TransactionsstatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionsstatementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsstatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
