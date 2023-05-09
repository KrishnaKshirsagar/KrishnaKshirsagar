import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialExampleModule } from "../../material.module";
import { PaymentRoutingModule } from "./payment-routing.module";
import { CoreModule } from "../../core/core.module";
import {
  PaymenthistoryComponent,
  PaymenthistoryDialog,
} from "./pages/paymenthistory/paymenthistory.component";
import { MatTableExporterModule } from "mat-table-exporter";
import { MatFormFieldModule } from "@angular/material/form-field";
import { PaymentErrorComponent } from "./pages/components/payment-error/payment-error.component";
import {
  EmandateshistoryComponent,
  EmandateshistoryDialog,
} from "./pages/emandateshistory/emandateshistory.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { MAT_DATE_LOCALE } from "@angular/material/core";
@NgModule({
  declarations: [
    PaymenthistoryComponent,
    PaymenthistoryDialog,
    EmandateshistoryComponent,
    EmandateshistoryDialog,
    PaymentErrorComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    MaterialExampleModule,
    MatFormFieldModule,
    PaymentRoutingModule,
    MatTableExporterModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
    FormsModule,
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
  ],
})
export class PaymentModule {}
