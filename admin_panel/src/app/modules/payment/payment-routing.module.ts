import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PaymenthistoryComponent } from "./pages/paymenthistory/paymenthistory.component";
import { EmandateshistoryComponent } from "./pages/emandateshistory/emandateshistory.component";

const routes: Routes = [
  { path: "", component: PaymenthistoryComponent },
  { path: "", redirectTo: "/payment/paymenthistory", pathMatch: "full" },
  { path: "paymenthistory", component: PaymenthistoryComponent },
  { path: "emandateshistory", component: EmandateshistoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule {}
