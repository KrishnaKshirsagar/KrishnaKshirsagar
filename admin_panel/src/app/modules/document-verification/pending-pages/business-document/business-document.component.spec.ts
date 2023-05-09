import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessDocumentComponent } from './business-document.component';

describe('BusinessDocumentComponent', () => {
  let component: BusinessDocumentComponent;
  let fixture: ComponentFixture<BusinessDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
