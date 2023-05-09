import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyFetchDialogComponent } from './company-fetch-dialog.component';

describe('CompanyFetchDialogComponent', () => {
  let component: CompanyFetchDialogComponent;
  let fixture: ComponentFixture<CompanyFetchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyFetchDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFetchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
