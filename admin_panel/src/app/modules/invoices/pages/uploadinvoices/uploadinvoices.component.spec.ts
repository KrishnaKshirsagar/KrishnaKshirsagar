import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UploadinvoicesComponent } from "./uploadinvoices.component";

describe("BuyerComponent", () => {
  let component: UploadinvoicesComponent;
  let fixture: ComponentFixture<UploadinvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadinvoicesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadinvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
