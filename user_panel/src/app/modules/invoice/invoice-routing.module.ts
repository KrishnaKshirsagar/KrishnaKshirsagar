import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SalesdashboardComponent } from "./pages/salesdashboard/salesdashboard.component";
import { PurchasedashboardComponent } from "./pages/purchasedashboard/purchasedashboard.component";
import { InvoiceuploadComponent } from "./pages/invoiceupload/invoiceupload.component";
import { InvoicedetailsComponent } from "./pages/invoicedetails/invoicedetails.component";
import { InvoicelistComponent } from "./pages/invoicelist/invoicelist.component";
const routes: Routes = [
  // { path: '', redirectTo: '/invoice/salesdashboard', pathMatch: 'full' },
  { path: "sales", component: SalesdashboardComponent },
  { path: "purchases", component: PurchasedashboardComponent },
  { path: "invoiceupload", component: InvoiceuploadComponent },
  { path: "invoicedetails", component: InvoicedetailsComponent },
  { path: "invoicelist", component: InvoicelistComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceRoutingModule {}
