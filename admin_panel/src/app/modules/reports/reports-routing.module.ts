import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsstatementComponent } from './pages/transactionsstatement/transactionsstatement.component';
import { MisreportsComponent } from './pages/misreports/misreports.component';
import { LedgerComponent } from './pages/ledger/ledger.component';
import { CompanysummaryComponent } from './pages/companysummary/companysummary.component';
import { InvoiceSummeryComponent } from './pages/invoicesummery/invoicesummery.component';
import { ReceivablesstatementComponent } from './pages/receivablesstatement/receivablesstatement.component';
import { DisbursementStatementComponent } from './pages/disbursement-statement/disbursement-statement.component';
import { ReceivablesageingComponent } from './pages/receivablesageing/receivablesageing.component';
import { ReceivablesAgeingByInvoiceComponent } from './pages/receivables-ageing-by-invoice/receivables-ageing-by-invoice.component';
import { TransactionLedgerComponent } from './pages/transaction-ledger/transactionledger.component';

const routes: Routes = [
  { path: "", component: TransactionsstatementComponent },
  { path: "", redirectTo: "/payment/transactionsstatement", pathMatch: "full" },
  { path: "transactionsstatement", component: TransactionsstatementComponent },
  { path: "misreports", component: MisreportsComponent },
  { path: "ledger", component: LedgerComponent },
  { path: "transaction-ledger", component: TransactionLedgerComponent },
  { path: "companies-summary", component: CompanysummaryComponent },
  { path: "invoice-summary", component: InvoiceSummeryComponent },
  { path: "receivablesstatement", component : ReceivablesstatementComponent},
  { path: "receivables_ageing", component:ReceivablesageingComponent},
  { path: "receivables_ageing_by_invoice", component: ReceivablesAgeingByInvoiceComponent},
  { path: "disbursement_statement", component: DisbursementStatementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
