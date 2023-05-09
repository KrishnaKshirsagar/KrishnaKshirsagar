import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SalesdashboardComponent } from "./salesdashboard.component";

describe("BuyerComponent", () => {
  let component: SalesdashboardComponent;
  let fixture: ComponentFixture<SalesdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesdashboardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
