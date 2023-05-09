import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CreditplanslistComponent } from "./creditplanslist.component";

describe("BuyerComponent", () => {
  let component: CreditplanslistComponent;
  let fixture: ComponentFixture<CreditplanslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditplanslistComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditplanslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
