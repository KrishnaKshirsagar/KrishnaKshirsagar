import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { CoreModule } from "src/app/core/core.module";
import { ApiService } from "./services/api/api.service";
import { InvoiceErrorComponent } from "./pages/components/invoice-error/invoice-error.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatTableExporterModule } from "mat-table-exporter";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialogRef } from "@angular/material/dialog";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { PayinvoicesRoutingModule } from "./payinvoices-routing.module";
import { InvoicelistComponent } from "./pages/invoicelist/invoicelist.component";
import { PaymentStatus } from "./pages/paymentstatus/paymentstatus.component";
import {
  InvoicestatusComponent,
  InvoicestatusDialog,
} from "./pages/invoicestatus/invoicestatus.component";
import { BulkpayDialogComponent } from "./pages/components/bulk-pay/bulkpay.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { DialogConfirmComponent } from "./pages/components/dialog-confirm/dialog-confirm.component";

@NgModule({
  declarations: [
    InvoiceErrorComponent,
    InvoicelistComponent,
    PaymentStatus,
    InvoicestatusComponent,
    InvoicestatusDialog,
    BulkpayDialogComponent,
    DialogConfirmComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    SharedModule,
    PayinvoicesRoutingModule,
    MatGridListModule,
    MatTableExporterModule,
    MatSnackBarModule,
    MatAutocompleteModule,
  ],
  providers: [ApiService, { provide: MatDialogRef, useValue: {} }],
})
export class PayinvoicesModule {}
