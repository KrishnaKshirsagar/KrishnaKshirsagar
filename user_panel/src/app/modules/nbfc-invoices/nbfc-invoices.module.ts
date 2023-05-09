import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NbfcInvoicesRoutingModule } from './nbfc-invoices-routing.module';
import { NBFCInvoicelistComponent } from './pages/nbfc-invoicelist/nbfc-invoicelist.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { CoreModule } from 'src/app/core/core.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ApiService } from './services/api/api.service';
import { PayouthistoryComponent } from './pages/payouthistory/payouthistory.component';
import { NBFCBuyerlistComponent } from "./pages/nbfc-buyerlist/nbfc-buyerlist.component";
import { KycDetails } from './pages/kyc-screen/kyc-screen.component';
import { CompanydetailsComponent, CompanydetailseditDialog } from './pages/companydetails/companydetails.component';
import { AuditTrailComponent } from './pages/components/audit-trail/audit-trail.component';
import { DisbursementComponent } from './pages/disbursement/disbursement.component';
import { ReconcilationHistoryComponent } from './pages/reconcilation-history/reconcilation-history.component';
import { ReconcilationComponent, ReconcilationDialog } from './pages/reconcilation/reconcilation.component';
import { KycDocDailogComponent } from './pages/components/kyc-doc-dailog/kyc-doc-dailog.component';
import { PaymenthistoryComponent } from './pages/payment-history/payment-history.component';

@NgModule({
  declarations: [
    NBFCInvoicelistComponent,
    NBFCBuyerlistComponent,
    CompanydetailsComponent,
    CompanydetailseditDialog,
    PayouthistoryComponent,
    KycDetails,
    AuditTrailComponent,
    ReconcilationComponent,
    DisbursementComponent,
    ReconcilationHistoryComponent,
    ReconcilationDialog,
    KycDocDailogComponent,
    PaymenthistoryComponent
  ],
  imports: [
    CommonModule,
    NbfcInvoicesRoutingModule,
    CommonModule,
    CoreModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    SharedModule,
    MatGridListModule,
    MatTableExporterModule,
    MatSnackBarModule,
    AutocompleteLibModule,
    MatAutocompleteModule,
  ],
  providers: 
  [
    ApiService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
  ],
})
export class NbfcInvoicesModule { }
