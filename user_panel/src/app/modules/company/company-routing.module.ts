import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UsersComponent } from "./pages/users/users.component";
import { CompanylistComponent } from "./pages/companylist/companylist.component";
import { BankaccountComponent } from "./pages/bankaccount/bankaccount.component";
import { RoleguardGuard } from "src/app/core/guards/roleguard/roleguard.guard";
import { CreditComponent } from "./pages/credit/credit.component";
import { KycComponent } from "./pages/kyc/kyc.component";
import { UsersdashboardComponent } from "./pages/usersdashboard/usersdashboard.component";
import { CompanydetailsComponent } from "./pages/companydetails/companydetails.component";
import { AssociatedEntitiesComponent } from "./pages/associated-entities/associated-entities.component";

const routes: Routes = [
  // { path: '', redirectTo: '/company/users', pathMatch: 'full'},
  { path: ":id/dashboard", component: UsersdashboardComponent },

  { path: ":id/company-details", component: CompanydetailsComponent },

  {
    path: ":id/users",
    component: UsersComponent,
    canActivate: [RoleguardGuard],
  },

  { path: "", component: CompanylistComponent },

  {
    path: ":id/bankaccount",
    component: BankaccountComponent,
    canActivate: [RoleguardGuard],
  },
  {
    path: ":id/credit",
    component: CreditComponent,
    canActivate: [RoleguardGuard],
  },
  {
    path: ":id/kyc",
    component: KycComponent,
    canActivate: [RoleguardGuard],
  },

  {
    path: ":id/associated-entities",
    component: AssociatedEntitiesComponent,
    // canActivate: [RoleguardGuard],
  },

  {
    path: ":id/bankaccount",
    component: BankaccountComponent,
    canActivate: [RoleguardGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
