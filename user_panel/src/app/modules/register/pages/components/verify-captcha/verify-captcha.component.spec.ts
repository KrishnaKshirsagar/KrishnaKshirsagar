import { ComponentFixture, TestBed } from "@angular/core/testing";

import { VerifyCaptchaComponent } from "./verify-captcha.component";

describe("VerifyCaptchaComponent", () => {
  let component: VerifyCaptchaComponent;
  let fixture: ComponentFixture<VerifyCaptchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyCaptchaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyCaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
