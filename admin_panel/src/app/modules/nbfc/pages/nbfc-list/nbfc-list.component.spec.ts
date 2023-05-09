import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NbfcListComponent } from "./nbfc-list.component";

describe("BuyerComponent", () => {
  let component: NbfcListComponent;
  let fixture: ComponentFixture<NbfcListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NbfcListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NbfcListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
