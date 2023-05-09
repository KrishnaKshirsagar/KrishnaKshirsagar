import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ForgotPasswordComponent } from "./pages/forgot-password/forgot-password.component";
import { LoginComponent } from "./pages/login/login.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";
import { VerifyUserComponent } from "./pages/verify-user/verify-user.component";

const routes: Routes = [
  { path: "", redirectTo: "/auth/login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  { path: "reset-password", component: ResetPasswordComponent },
  { path: "verify-user", component: VerifyUserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
