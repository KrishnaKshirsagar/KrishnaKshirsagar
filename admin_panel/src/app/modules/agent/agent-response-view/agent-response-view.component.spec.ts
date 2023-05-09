import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentResponseViewComponent } from './agent-response-view.component';

describe('AgentResponseViewComponent', () => {
  let component: AgentResponseViewComponent;
  let fixture: ComponentFixture<AgentResponseViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentResponseViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentResponseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
