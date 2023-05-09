import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowUploadHistoryComponent } from './show-upload-history.component';

describe('ShowUploadHistoryComponent', () => {
  let component: ShowUploadHistoryComponent;
  let fixture: ComponentFixture<ShowUploadHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowUploadHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowUploadHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
