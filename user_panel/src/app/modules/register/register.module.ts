import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PasswordStrengthMeterModule } from "angular-password-strength-meter";
import { RegisterRoutingModule } from "./register-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { CoreModule } from "src/app/core/core.module";
import { ApiService } from "./services/api/api.service";
import { RegisterErrorComponent } from "./pages/components/register-error/register-error.component";
import { EntityComponent } from "./pages/entity/entity.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { VerifyCaptchaComponent } from "./pages/components/verify-captcha/verify-captcha.component";
import { MatDialogRef } from "@angular/material/dialog";
@NgModule({
  declarations: [
    EntityComponent,
    RegisterErrorComponent,
    VerifyCaptchaComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordStrengthMeterModule,
    SharedModule,
    RegisterRoutingModule,
    MatSnackBarModule,
  ],
  providers: [ApiService, { provide: MatDialogRef, useValue: {} }],
})
export class RegisterModule {}
