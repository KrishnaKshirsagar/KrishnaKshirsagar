import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { EntityComponent } from "./pages/entity/entity.component";

const routes: Routes = [
  { path: "", redirectTo: "/register/entity", pathMatch: "full" },
  { path: "entity", component: EntityComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterRoutingModule {}
