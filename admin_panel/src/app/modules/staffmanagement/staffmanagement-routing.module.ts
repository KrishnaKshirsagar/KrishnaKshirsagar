import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MappingComponent } from "./pages/mapping/mapping.component";
import { StafflistComponent } from "./pages/stafflist/stafflist.component";

const routes: Routes = [
  { path: "", component: StafflistComponent },
  { path: "", redirectTo: "/staffmanagement/stafflist", pathMatch: "full" },
  { path: "stafflist", component: StafflistComponent },
  { path: "mapping", component: MappingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaffmanagementRoutingModule {}
