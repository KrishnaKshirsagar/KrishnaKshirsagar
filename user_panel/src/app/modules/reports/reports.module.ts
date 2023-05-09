import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PasswordStrengthMeterModule } from "angular-password-strength-meter";
import { SharedModule } from "src/app/shared/shared.module";
import { CoreModule } from "src/app/core/core.module";
import { ApiService } from "./services/api/api.service";
import { ReportsErrorComponent } from "./pages/components/reports-error/reports-error.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatFileUploadModule } from "angular-material-fileupload";
import { MatTableExporterModule } from "mat-table-exporter";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialogRef } from "@angular/material/dialog";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { ReportsRoutingModule } from "./reports-routing.module";
import { TransactionalstatementComponent } from "./pages/transactionalstatement/transactionalstatement.component";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { TransactionLedgerComponent } from "./pages/transaction-ledger/transactionledger.component";
import { BuyerVirtualAccountsComponent } from './pages/buyer-virtual-accounts/buyer-virtual-accounts.component';
import { RecievablesAgeingByInvoiceComponent } from './pages/recievables-ageing-by-invoice/recievables-ageing-by-invoice.component';

@NgModule({
  declarations: [
    ReportsErrorComponent,
    TransactionalstatementComponent,
    TransactionLedgerComponent,
    BuyerVirtualAccountsComponent,
    RecievablesAgeingByInvoiceComponent
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
    MatAutocompleteModule,
    ReportsRoutingModule,
    MatGridListModule,
    MatTableExporterModule,
    MatSnackBarModule,
  ],
  providers: [ApiService, 
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
})
export class ReportsModule {}
