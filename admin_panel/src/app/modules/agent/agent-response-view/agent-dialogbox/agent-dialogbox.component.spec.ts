import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDialogboxComponent } from './agent-dialogbox.component';

describe('AgentDialogboxComponent', () => {
  let component: AgentDialogboxComponent;
  let fixture: ComponentFixture<AgentDialogboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentDialogboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentDialogboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
