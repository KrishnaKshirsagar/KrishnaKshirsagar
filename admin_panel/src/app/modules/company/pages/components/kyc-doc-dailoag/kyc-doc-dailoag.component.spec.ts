import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycDocDailoagComponent } from './kyc-doc-dailoag.component';

describe('KycDocDailoagComponent', () => {
  let component: KycDocDailoagComponent;
  let fixture: ComponentFixture<KycDocDailoagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycDocDailoagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycDocDailoagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
