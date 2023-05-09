import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerinvoicesComponent } from './buyerinvoices.component';

describe('BuyerComponent', () => {
  let component: BuyerinvoicesComponent;
  let fixture: ComponentFixture<BuyerinvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyerinvoicesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerinvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
