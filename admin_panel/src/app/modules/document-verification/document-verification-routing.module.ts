import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocVerficationDashboardComponent } from './doc-verfication-dashboard/doc-verfication-dashboard.component';
import { ApprovedComponent } from './approved-pages/approved/approved.component';
import { BusinessDocumentComponent } from './pending-pages/business-document/business-document.component';
import { KycDocumentComponent } from './pending-pages/kyc-document/kyc-document.component';
import { PendingComponent } from './pending-pages/pending/pending.component';
import { RejectedComponent } from './rejected-pages/rejected/rejected.component';

const routes: Routes = [
  { path: "", component: DocVerficationDashboardComponent  },
  { path: "approved", component: ApprovedComponent },
  { path: "rejected", component: RejectedComponent },
  { path: "pending", component: PendingComponent },
  { path: "kyc_document/:id", component: KycDocumentComponent },
  { path: "business_document/:id", component: BusinessDocumentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentVerificationRoutingModule { }
