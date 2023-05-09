import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EmandateshistoryComponent } from "./emandateshistory.component";

describe("BuyerComponent", () => {
  let component: EmandateshistoryComponent;
  let fixture: ComponentFixture<EmandateshistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmandateshistoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmandateshistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
