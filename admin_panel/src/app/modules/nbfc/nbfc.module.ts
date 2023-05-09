import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialExampleModule } from "../../material.module";
import { NbfcRoutingModule } from "./nbfc-routing.module";
import { CoreModule } from "../../core/core.module";
import {
  NbfcListComponent,
  NbfcListDialog,
} from "./pages/nbfc-list/nbfc-list.component";
import { MatTableExporterModule } from "mat-table-exporter";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NbfcErrorComponent } from "./pages/components/nbfc-error/nbfc-error.component";
import {
  AddNbfcComponent,
  AddNbfcDialog,
} from "./pages/add-nbfc/add-nbfc.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MultiselectAutocompleteComponent } from "./pages/components/multiselect-autocomplete/multiselect-autocomplete.component";
import {
  NbfcMappingComponent,
  NbfcMappingDialog,
} from "./pages/nbfc-mapping/nbfc-mapping.component";
import {
  ReconciliationComponent,
  ReconciliationDialog,
} from "./pages/reconciliation/reconciliation.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MAT_DATE_LOCALE } from "@angular/material/core";
@NgModule({
  declarations: [
    NbfcListComponent,
    NbfcListDialog,
    AddNbfcComponent,
    AddNbfcDialog,
    NbfcMappingComponent,
    NbfcMappingDialog,
    ReconciliationComponent,
    ReconciliationDialog,
    NbfcErrorComponent,
    MultiselectAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    MaterialExampleModule,
    MatFormFieldModule,
    NbfcRoutingModule,
    MatTableExporterModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
  ],
})
export class NbfcModule {}
