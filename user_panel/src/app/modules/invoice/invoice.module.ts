import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PasswordStrengthMeterModule } from "angular-password-strength-meter";
import { InvoiceRoutingModule } from "./invoice-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { CoreModule } from "src/app/core/core.module";
import { ApiService } from "./services/api/api.service";
import { InvoiceErrorComponent } from "./pages/components/invoice-error/invoice-error.component";
import {
  CommentDialog,
  SalesdashboardComponent,
  SalesdashboardDialog,
} from "./pages/salesdashboard/salesdashboard.component";
import {
  PurchasedashboardComponent,
  PurchasedashboardDialog,
} from "./pages/purchasedashboard/purchasedashboard.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatFormFieldModule } from "@angular/material/form-field";
import {
  InvoiceuploadComponent,
  InvoiceuploadDialog,
} from "./pages/invoiceupload/invoiceupload.component";
import { MatFileUploadModule } from "angular-material-fileupload";
import { MatTableExporterModule } from "mat-table-exporter";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialogRef } from "@angular/material/dialog";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import {
  InvoicedetailsComponent,
  InvoicedetailsDialog,
} from "./pages/invoicedetails/invoicedetails.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { InvoicelistComponent } from "./pages/invoicelist/invoicelist.component";
import { MatTabsModule } from "@angular/material/tabs";
import { ShowUploadHistoryComponent } from './pages/components/show-upload-history/show-upload-history.component';

@NgModule({
  declarations: [
    SalesdashboardComponent,
    InvoiceuploadComponent,
    InvoiceuploadDialog,
    InvoiceErrorComponent,
    InvoicedetailsComponent,
    InvoicedetailsDialog,
    SalesdashboardDialog,
    PurchasedashboardComponent,
    PurchasedashboardDialog,
    InvoicelistComponent, //Dev by Shubham(BNGLR)
    CommentDialog, ShowUploadHistoryComponent,
  ],
  imports: [
    CommonModule,
    MatFileUploadModule,
    CoreModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    PasswordStrengthMeterModule,
    SharedModule,
    InvoiceRoutingModule,
    MatGridListModule,
    MatTableExporterModule,
    MatSnackBarModule,
    AutocompleteLibModule,
    MatAutocompleteModule,
    MatTabsModule,
  ],
  providers: [ApiService, { provide: MatDialogRef, useValue: {} }],
})
export class InvoiceModule {}
