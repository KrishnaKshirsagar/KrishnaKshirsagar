import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialExampleModule } from '../../material.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { CoreModule } from '../../core/core.module';
import { TransactionsstatementComponent, TransactionsstatementDialog,} from './pages/transactionsstatement/transactionsstatement.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReportsErrorComponent } from './pages/components/reports-error/reports-error.component';
import { MisreportsComponent, MisreportsDialog } from './pages/misreports/misreports.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LedgerComponent, LedgerDialog } from './pages/ledger/ledger.component';
import { CompanysummaryComponent } from './pages/companysummary/companysummary.component';
import { InvoiceSummeryComponent } from './pages/invoicesummery/invoicesummery.component';
import { ReceivablesstatementComponent } from './pages/receivablesstatement/receivablesstatement.component';
import { ReceivablesageingComponent } from './pages/receivablesageing/receivablesageing.component';
import { ReceivablesAgeingByInvoiceComponent } from './pages/receivables-ageing-by-invoice/receivables-ageing-by-invoice.component';
import { DisbursementStatementComponent } from './pages/disbursement-statement/disbursement-statement.component';
import { TransactionLedgerComponent } from './pages/transaction-ledger/transactionledger.component';
@NgModule({
  declarations: [
    TransactionsstatementComponent,
    TransactionsstatementDialog,
    LedgerComponent,
    LedgerDialog,
    MisreportsComponent,
    MisreportsDialog,
    ReportsErrorComponent,
    CompanysummaryComponent,
    InvoiceSummeryComponent,
    ReceivablesstatementComponent,
    ReceivablesageingComponent,
    ReceivablesAgeingByInvoiceComponent,
    TransactionLedgerComponent,
    DisbursementStatementComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    MaterialExampleModule,
    MatFormFieldModule,
    ReportsRoutingModule,
    MatTableExporterModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
  ],
})
export class ReportsModule {}
