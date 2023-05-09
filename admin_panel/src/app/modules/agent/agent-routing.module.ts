import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentResponseViewComponent } from './agent-response-view/agent-response-view.component';

const routes: Routes = [
  { path: "agent-response", component: AgentResponseViewComponent },
  { path: "", component: AgentResponseViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentRoutingModule { }
