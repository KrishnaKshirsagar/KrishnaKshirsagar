import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CompanylistComponent } from "./pages/companylist/companylist.component";
import { CompanydetailsComponent } from "./pages/companydetails/companydetails.component";
import { CreditplansComponent } from "./pages/creditplans/creditplans.component";
import { CreditplanslistComponent } from "./pages/creditplanslist/creditplanslist.component";
import { CreditlimitverificationComponent } from "./pages/creditlimitverification/creditlimitverification.component";
import { CreditlimithistoryComponent } from "./pages/creditlimithistory/creditlimithistory.component";
import { KycDetails } from "./pages/kyc-screen/kyc-screen.component";
import { GSTDetails } from "./pages/gst-screen/gst-screen.component";
import { OfflinepaymentComponent } from "./pages/offlinepayment/offlinepayment.component";
import { EsignComponent } from "./pages/esign/esign.component";
import { KycComponent } from "./pages/kyc/kyc.component";

const routes: Routes = [
  { path: "", component: CompanylistComponent },
  { path: "companylist", component: CompanylistComponent },
  { path: "offlinepayment", component: OfflinepaymentComponent },
  { path: ":id/e-sign", component: EsignComponent },
  { path: ":id/creditplans/:id", component: CreditplansComponent },
  { path: ":id/creditplanslist", component: CreditplanslistComponent },
  { path: ":id/companydetails", component: CompanydetailsComponent },
  { path: ":id/kycdetails", component: KycDetails },
  { path: ":id/kyc_upload", component: KycComponent },
  { path: ":id/gstdetails", component: GSTDetails },
  {
    path: "creditlimitverification",
    component: CreditlimitverificationComponent,
  },
  { path: "creditlimithistory", component: CreditlimithistoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
