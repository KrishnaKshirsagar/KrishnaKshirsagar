import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivablesageingComponent } from './receivablesageing.component';

describe('ReceivablesageingComponent', () => {
  let component: ReceivablesageingComponent;
  let fixture: ComponentFixture<ReceivablesageingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivablesageingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivablesageingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
