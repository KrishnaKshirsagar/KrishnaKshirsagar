import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconcilationHistoryComponent } from './reconcilation-history.component';

describe('ReconcilationHistoryComponent', () => {
  let component: ReconcilationHistoryComponent;
  let fixture: ComponentFixture<ReconcilationHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconcilationHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconcilationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
