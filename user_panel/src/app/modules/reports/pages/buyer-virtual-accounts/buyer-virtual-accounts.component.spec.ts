import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerVirtualAccountsComponent } from './buyer-virtual-accounts.component';

describe('BuyerVirtualAccountsComponent', () => {
  let component: BuyerVirtualAccountsComponent;
  let fixture: ComponentFixture<BuyerVirtualAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerVirtualAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerVirtualAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
