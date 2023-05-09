import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocVerficationDashboardComponent } from './doc-verfication-dashboard.component';

describe('DocVerficationDashboardComponent', () => {
  let component: DocVerficationDashboardComponent;
  let fixture: ComponentFixture<DocVerficationDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocVerficationDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocVerficationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
