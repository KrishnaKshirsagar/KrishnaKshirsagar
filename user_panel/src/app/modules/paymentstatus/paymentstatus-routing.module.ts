import { NgModule } from "@angular/core";
import { PaymentStatus } from "./pages/paymentstatus.component";
import { RouterModule, Routes } from "@angular/router";
import { EMandateStatus } from "./pages/eMandateStatus/eMandatestatus.component";

const routes: Routes = [
  { path: "", component: PaymentStatus },
  { path: "emandate", component: EMandateStatus },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentstatusRoutingModule {}
