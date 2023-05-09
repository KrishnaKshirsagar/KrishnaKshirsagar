import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UsermanagementErrorComponent } from "./usermanagement-error.component";

describe("ConnectionPasswordDialogComponent", () => {
  let component: UsermanagementErrorComponent;
  let fixture: ComponentFixture<UsermanagementErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsermanagementErrorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsermanagementErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
