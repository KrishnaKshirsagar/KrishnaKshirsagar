import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ReportsErrorComponent } from "./reports-error.component";

describe("ConnectionPasswordDialogComponent", () => {
  let component: ReportsErrorComponent;
  let fixture: ComponentFixture<ReportsErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentErrorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
