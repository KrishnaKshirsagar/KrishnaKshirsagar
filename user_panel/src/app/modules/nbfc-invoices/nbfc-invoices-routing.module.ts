import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanydetailsComponent } from './pages/companydetails/companydetails.component';
import { DisbursementComponent } from './pages/disbursement/disbursement.component';
import { KycDetails } from './pages/kyc-screen/kyc-screen.component';
import { NBFCBuyerlistComponent } from './pages/nbfc-buyerlist/nbfc-buyerlist.component';
import { NBFCInvoicelistComponent } from './pages/nbfc-invoicelist/nbfc-invoicelist.component';
import { PaymenthistoryComponent } from './pages/payment-history/payment-history.component';
import { PayouthistoryComponent } from './pages/payouthistory/payouthistory.component';
import { ReconcilationHistoryComponent } from './pages/reconcilation-history/reconcilation-history.component';
import { ReconcilationComponent } from './pages/reconcilation/reconcilation.component';


const routes: Routes = [
  { path: "", component: NBFCInvoicelistComponent },
  { path: "invoices", component: NBFCInvoicelistComponent },
  { path: "buyers", component: NBFCBuyerlistComponent },
  { path: "buyers/:id/kycdetails", component: KycDetails },
  { path: "buyers/:id/details", component: CompanydetailsComponent },
  { path: "payout_history", component: PayouthistoryComponent },
  { path: "reconcilation_history",component:ReconcilationHistoryComponent},
  {path:"reconcilation",component:ReconcilationComponent},
  {path:"disbursment",component:DisbursementComponent},
  {path :"payment", component:PaymenthistoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NbfcInvoicesRoutingModule { }
