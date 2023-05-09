import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UsersdashboardComponent } from "./usersdashboard.component";

describe("BuyerComponent", () => {
  let component: UsersdashboardComponent;
  let fixture: ComponentFixture<UsersdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersdashboardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
