import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { InvoicelistComponent } from "./pages/invoicelist/invoicelist.component";
import { InvoicestatusComponent } from "./pages/invoicestatus/invoicestatus.component";
import { PaymentStatus } from "./pages/paymentstatus/paymentstatus.component";
const routes: Routes = [
  { path: "", redirectTo: "/invoicelist", pathMatch: "full" },
  { path: "invoicelist", component: InvoicestatusComponent },
  { path: "invoicelist/:id", component: InvoicelistComponent },
  { path: "status", component: PaymentStatus },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayinvoicesRoutingModule {}
