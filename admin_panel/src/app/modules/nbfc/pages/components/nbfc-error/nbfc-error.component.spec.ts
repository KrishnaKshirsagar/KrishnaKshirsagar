import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NbfcErrorComponent } from "./nbfc-error.component";

describe("ConnectionPasswordDialogComponent", () => {
  let component: NbfcErrorComponent;
  let fixture: ComponentFixture<NbfcErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NbfcErrorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NbfcErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
