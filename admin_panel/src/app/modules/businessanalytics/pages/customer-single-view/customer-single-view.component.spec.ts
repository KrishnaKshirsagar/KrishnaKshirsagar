import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSingleViewComponent } from './customer-single-view.component';

describe('CustomerSingleViewComponent', () => {
  let component: CustomerSingleViewComponent;
  let fixture: ComponentFixture<CustomerSingleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSingleViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSingleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
