import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycDocDailogComponent } from './kyc-doc-dailog.component';

describe('KycDocDailogComponent', () => {
  let component: KycDocDailogComponent;
  let fixture: ComponentFixture<KycDocDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycDocDailogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycDocDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
