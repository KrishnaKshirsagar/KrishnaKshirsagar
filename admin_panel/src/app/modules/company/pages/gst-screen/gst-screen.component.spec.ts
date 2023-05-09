import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GSTDetails } from "./gst-screen.component";

describe("NewScreenComponent", () => {
  let component: GSTDetails;
  let fixture: ComponentFixture<GSTDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GSTDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(GSTDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
