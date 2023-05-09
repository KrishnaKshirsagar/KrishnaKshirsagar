import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CollectionErrorComponent } from "./collection-error.component";

describe("ConnectionPasswordDialogComponent", () => {
  let component: CollectionErrorComponent;
  let fixture: ComponentFixture<CollectionErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollectionErrorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
