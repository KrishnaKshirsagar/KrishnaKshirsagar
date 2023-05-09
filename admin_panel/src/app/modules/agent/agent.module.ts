import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentRoutingModule } from './agent-routing.module';
import { AgentResponseViewComponent } from './agent-response-view/agent-response-view.component';
import { CoreModule } from "../../core/core.module";
import { MatTableModule } from '@angular/material/table';
import { MaterialExampleModule } from 'src/app/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatTableExporterModule } from 'mat-table-exporter';
import { AgentDialogboxComponent } from './agent-response-view/agent-dialogbox/agent-dialogbox.component';
@NgModule({
  declarations: [
    AgentResponseViewComponent,
    AgentDialogboxComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    AgentRoutingModule,
    MatTableModule,
    CommonModule,
    CoreModule,
    MaterialExampleModule,
    MatFormFieldModule,
    MatTableExporterModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
    FormsModule,
  ]
})
export class AgentModule {}
