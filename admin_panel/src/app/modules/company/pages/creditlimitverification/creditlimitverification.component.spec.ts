import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CreditlimitverificationComponent } from "./creditlimitverification.component";

describe("BuyerComponent", () => {
  let component: CreditlimitverificationComponent;
  let fixture: ComponentFixture<CreditlimitverificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditlimitverificationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditlimitverificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
