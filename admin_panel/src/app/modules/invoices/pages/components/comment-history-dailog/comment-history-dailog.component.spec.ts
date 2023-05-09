import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentHistoryDailogComponent } from './comment-history-dailog.component';

describe('CommentHistoryDailogComponent', () => {
  let component: CommentHistoryDailogComponent;
  let fixture: ComponentFixture<CommentHistoryDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentHistoryDailogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentHistoryDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
