import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NbfcListComponent } from "./pages/nbfc-list/nbfc-list.component";
import { AddNbfcComponent } from "./pages/add-nbfc/add-nbfc.component";
import { NbfcMappingComponent } from "./pages/nbfc-mapping/nbfc-mapping.component";
import { ReconciliationComponent } from "./pages/reconciliation/reconciliation.component";

const routes: Routes = [
  { path: "", component: NbfcListComponent },
  { path: "", redirectTo: "/payment/transactionsstatement", pathMatch: "full" },
  { path: "nbfc-list", component: NbfcListComponent },
  { path: "add-nbfc", component: AddNbfcComponent },
  { path: "nbfc-mapping", component: NbfcMappingComponent },
  { path: "reconciliation", component: ReconciliationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NbfcRoutingModule {}
