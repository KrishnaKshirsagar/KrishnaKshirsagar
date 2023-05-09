import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthRoutingModule } from "./auth-routing.module";
import { LoginComponent } from "./pages/login/login.component";
import { ForgotPasswordComponent } from "./pages/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";
import { MaterialExampleModule } from "../../material.module";
// import { CoreModule } from 'src/app/core/core.module';
// import { SharedModule } from 'src/app/shared/shared.module';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ApiService } from "./services/api/api.service";
import { BrowserModule } from "@angular/platform-browser";
import { VerifyUserComponent } from "./pages/verify-user/verify-user.component";
@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    VerifyUserComponent,
  ],
  imports: [
    CommonModule,
    // CoreModule,
    ReactiveFormsModule,
    // SharedModule,
    AuthRoutingModule,
    MaterialExampleModule,
    MatSnackBarModule,
    // BrowserModule
  ],
  // providers: [],
  providers: [ApiService],
})
export class AuthModule {}
