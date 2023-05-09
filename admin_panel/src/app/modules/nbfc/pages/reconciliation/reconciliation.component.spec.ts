import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ReconciliationComponent } from "./reconciliation.component";

describe("BuyerComponent", () => {
  let component: ReconciliationComponent;
  let fixture: ComponentFixture<ReconciliationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReconciliationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
