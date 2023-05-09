import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NbfcMappingComponent } from "./nbfc-mapping.component";

describe("BuyerComponent", () => {
  let component: NbfcMappingComponent;
  let fixture: ComponentFixture<NbfcMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NbfcMappingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NbfcMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
