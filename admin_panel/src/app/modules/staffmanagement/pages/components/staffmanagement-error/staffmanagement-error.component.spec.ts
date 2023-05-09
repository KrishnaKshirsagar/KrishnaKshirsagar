import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StaffmanagementErrorComponent } from "./staffmanagement-error.component";

describe("ConnectionPasswordDialogComponent", () => {
  let component: StaffmanagementErrorComponent;
  let fixture: ComponentFixture<StaffmanagementErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaffmanagementErrorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffmanagementErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
