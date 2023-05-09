import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CIHhistoryComponent } from "./pages/cihhistory/cihhistory.component";
import { PaymenthistoryComponent } from "./pages/paymenthistory/paymenthistory.component";

const routes: Routes = [
  { path: "", component: PaymenthistoryComponent },
  { path: "cih-history", component: CIHhistoryComponent },

  // { path: 'paymentstatus', component: PaymentStatus },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule {}
