import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CompanyErrorComponent } from "./company-error.component";

describe("ConnectionPasswordDialogComponent", () => {
  let component: CompanyErrorComponent;
  let fixture: ComponentFixture<CompanyErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyErrorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
