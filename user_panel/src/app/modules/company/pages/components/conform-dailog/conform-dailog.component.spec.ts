import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ConformDailogComponent } from "./conform-dailog.component";

describe("ConformDailogComponent", () => {
  let component: ConformDailogComponent;
  let fixture: ComponentFixture<ConformDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConformDailogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConformDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
