import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconcilationComponent } from './reconcilation.component';

describe('ReconcilationComponent', () => {
  let component: ReconcilationComponent;
  let fixture: ComponentFixture<ReconcilationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconcilationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconcilationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
