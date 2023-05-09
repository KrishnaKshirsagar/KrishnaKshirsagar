import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivablesstatementComponent } from './receivablesstatement.component';

describe('ReceivablesstatementComponent', () => {
  let component: ReceivablesstatementComponent;
  let fixture: ComponentFixture<ReceivablesstatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivablesstatementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivablesstatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
