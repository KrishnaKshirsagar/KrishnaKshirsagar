import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BuyerVirtualAccountsComponent } from "./pages/buyer-virtual-accounts/buyer-virtual-accounts.component";
import { RecievablesAgeingByInvoiceComponent } from "./pages/recievables-ageing-by-invoice/recievables-ageing-by-invoice.component";
import { TransactionLedgerComponent } from "./pages/transaction-ledger/transactionledger.component";
import { TransactionalstatementComponent } from "./pages/transactionalstatement/transactionalstatement.component";
const routes: Routes = [
  {
    path: "transactionalstatement",
    component: TransactionalstatementComponent,
  },
  {
    path: "transactional-ledger",
    component: TransactionLedgerComponent,
  },
  {
    path: "virtual-accounts",
    component: BuyerVirtualAccountsComponent,
  },
  {
    path: "recievable-ageing-by-invoices",
    component: RecievablesAgeingByInvoiceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
