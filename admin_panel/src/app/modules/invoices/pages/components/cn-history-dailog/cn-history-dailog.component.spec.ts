import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnHistoryDailogComponent } from './cn-history-dailog.component';

describe('CnHistoryDailogComponent', () => {
  let component: CnHistoryDailogComponent;
  let fixture: ComponentFixture<CnHistoryDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnHistoryDailogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CnHistoryDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
