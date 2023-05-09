import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AddNbfcComponent } from "./add-nbfc.component";

describe("BuyerComponent", () => {
  let component: AddNbfcComponent;
  let fixture: ComponentFixture<AddNbfcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddNbfcComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNbfcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
