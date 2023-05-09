import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ManageCollectionComponent } from "./pages/manage-collection/manage-collection.component";
import { MappingComponent } from "./pages/mapping/mapping.component";
import { OverDueInvoicesComponent } from "./pages/over-due-invoices/over-due-invoices.component";

const routes: Routes = [
  { path: "", component: OverDueInvoicesComponent },
  { path: "", redirectTo: "/collection/over-due-invoices", pathMatch: "full" },
  { path: "overdueinvoices", component: OverDueInvoicesComponent },
  { path: "managecollection", component: ManageCollectionComponent },
  { path: "mapping", component: MappingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollectionRoutingModule {}
