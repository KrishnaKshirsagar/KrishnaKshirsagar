import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./modules/auth/pages/login/login.component";
import { AuthGuard } from "./core/guards/auth/auth.guard";
import { NoAuthGuard } from "./core/guards/no-auth/no-auth.guard";
import { RoleguardGuard } from "./core/guards/roleguard/roleguard.guard";
// import { ForbiddenComponent } from './core/pages/forbidden/forbidden.component';
import { ErrorComponent } from "./core/pages/error/error.component";
// import { NotFoundComponent } from './core/pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: "error",
    component: ErrorComponent,
  },
  {
    path: "",
    component: LoginComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: "admin/auth",
    loadChildren: () =>
      import("./modules/auth/auth.module").then((m) => m.AuthModule),
    canActivate: [NoAuthGuard],
  },
  {
    path: "admin/companies",
    loadChildren: () =>
      import("./modules/company/company.module").then((m) => m.CompanyModule),
    canActivate: [AuthGuard],
  },
  {
    path: "admin/dashboard",
    loadChildren: () =>
      import("./modules/dashboard/dashboard.module").then(
        (m) => m.DashboardModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: "admin/businessanalytics",
    loadChildren: () =>
      import("./modules/businessanalytics/businessanalytics.module").then(
        (m) => m.BusinessanalyticsModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: "admin/invoices",
    loadChildren: () =>
      import("./modules/invoices/invoices.module").then(
        (m) => m.InvoicesModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: "staffmanagement",
    loadChildren: () =>
      import("./modules/staffmanagement/staffmanagement.module").then(
        (m) => m.StaffmanagementModule
      ),
    canActivate: [AuthGuard, RoleguardGuard],
  },

  {
    path: "admin/collection",
    loadChildren: () =>
      import("./modules/collection/collection.module").then(
        (m) => m.CollectionModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: "usermanagement",
    loadChildren: () =>
      import("./modules/usermanagement/usermanagement.module").then(
        (m) => m.UsermanagementModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: "admin/payment",
    loadChildren: () =>
      import("./modules/payment/payment.module").then((m) => m.PaymentModule),
    canActivate: [AuthGuard],
  },

  {
    path: "admin/reports",
    loadChildren: () =>
      import("./modules/reports/reports.module").then((m) => m.ReportsModule),
    canActivate: [AuthGuard],
  },

  {
    path: "admin/nbfc",
    loadChildren: () =>
      import("./modules/nbfc/nbfc.module").then((m) => m.NbfcModule),
    canActivate: [AuthGuard],
  },
  {
    path: "agent",
    loadChildren: () =>
      import("./modules/agent/agent.module").then((m) => m.AgentModule),
    canActivate: [AuthGuard]
  },
  {
    path: "admin/document-verification",
    loadChildren: () =>
      import("./modules/document-verification/document-verification.module").then((m) => m.DocumentVerificationModule),
      canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
