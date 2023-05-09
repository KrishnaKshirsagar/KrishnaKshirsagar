import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./core/guards/auth/auth.guard";
import { NoAuthGuard } from "./core/guards/no-auth/no-auth.guard";
import { ForbiddenComponent } from "./core/pages/forbidden/forbidden.component";
import { ErrorComponent } from "./core/pages/error/error.component";
import { HomeComponent } from "./core/pages/home/home.component";
import { IndexComponent } from "./core/pages/index/index.component";
import { NotFoundComponent } from "./core/pages/not-found/not-found.component";
import { PrivacypolicyComponent } from "./core/pages/privacypolicy/privacypolicy.component";
import { TermsandconditionsComponent } from "./core/pages/termsandconditions/termsandconditions.component";
import { LoginComponent } from "./modules/auth/pages/login/login.component";

const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "privacypolicy",
    component: PrivacypolicyComponent,
  },
  {
    path: "termsandconditions",
    component: TermsandconditionsComponent,
  },

  {
    path: "forbidden",
    component: ForbiddenComponent,
  },
  {
    path: "error",
    component: ErrorComponent,
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./modules/auth/auth.module").then((m) => m.AuthModule),
    canActivate: [NoAuthGuard],
  },
  {
    path: "register",
    loadChildren: () =>
      import("./modules/register/register.module").then(
        (m) => m.RegisterModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: "companies",
    loadChildren: () =>
      import("./modules/company/company.module").then((m) => m.CompanyModule),
    canActivate: [AuthGuard],
  },

  {
    path: "invoices",
    loadChildren: () =>
      import("./modules/payinvoices/payinvoices.module").then(
        (m) => m.PayinvoicesModule
      ),
  },

  {
    path: "companies/:id/invoices",
    loadChildren: () =>
      import("./modules/invoice/invoice.module").then((m) => m.InvoiceModule),
    canActivate: [AuthGuard],
  },

  {
    path: "companies/:id/transactions",
    loadChildren: () =>
      import("./modules/payment/payment.module").then((m) => m.PaymentModule),
      canActivate: [AuthGuard],
  },

  {
    path: "companies/:id/paymentstatus",
    loadChildren: () =>
      import("./modules/paymentstatus/paymentstatus.module").then(
        (m) => m.PaymentStatusModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: "companies/:id/reports",
    loadChildren: () =>
      import("./modules/reports/reports.module").then((m) => m.ReportsModule),
    canActivate: [AuthGuard],
  },

  //For nbfc use only
  { 
    path: "nbfcs",
    loadChildren: () =>
      import("./modules/company/company.module").then((m) => m.CompanyModule),
    canActivate: [AuthGuard],
  },

  {
    path: "nbfcs/:id",
    loadChildren: () =>
      import("./modules/nbfc-invoices/nbfc-invoices.module").then((m) => m.NbfcInvoicesModule),
      canActivate: [AuthGuard],
  },

  // {
  //   path: '**',
  //   component: NotFoundComponent,
  // },

  {
    path: "**",
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
