import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CreditplansComponent } from "./creditplans.component";

describe("BuyerComponent", () => {
  let component: CreditplansComponent;
  let fixture: ComponentFixture<CreditplansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditplansComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditplansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
