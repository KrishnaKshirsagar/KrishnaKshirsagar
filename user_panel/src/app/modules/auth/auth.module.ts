import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { PasswordStrengthMeterModule } from "angular-password-strength-meter";
import { AuthRoutingModule } from "./auth-routing.module";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { ForgotPasswordComponent } from "./pages/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";
import { VerifyUserComponent } from "./pages/verify-user/verify-user.component";
import { SharedModule } from "src/app/shared/shared.module";
import { CoreModule } from "src/app/core/core.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from "angularx-social-login";
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from "ng-recaptcha";
import { environment } from "src/environments/environment";


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    VerifyUserComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    ReactiveFormsModule,
    PasswordStrengthMeterModule,
    SharedModule,
    AuthRoutingModule,
    // SocialLoginModule,
    MatSnackBarModule,
    RecaptchaV3Module
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKey,
    },
    
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              // '1050585140497-mqi5agjc493sfj5dc9cokfiv0dj9lcj4.apps.googleusercontent.com', // for uat.xuriti.app
              "1050585140497-2ph0p4gfi3u10bkjl2f76l74rc3ttvuo.apps.googleusercontent.com" // for dev.xuriti.app
              // "1050585140497-120eltk0cekhia8kt97s2k6o8u80uegr.apps.googleusercontent.com" //for localhost
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  // providers: [ApiService],
})
export class AuthModule {}
