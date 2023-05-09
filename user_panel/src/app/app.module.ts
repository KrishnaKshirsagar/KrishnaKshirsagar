import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCommonModule } from "@angular/material/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { NbfcInvoicesModule } from './modules/nbfc-invoices/nbfc-invoices.module';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from "angularx-social-login";
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from "ng-recaptcha";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatCommonModule,
    MatExpansionModule,
    RecaptchaV3Module,

    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: "registerWhenStable:30000",
    }),
    CoreModule,
    SharedModule,
    NbfcInvoicesModule,
    SocialLoginModule
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKey,
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
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
  bootstrap: [AppComponent],
})
export class AppModule {}
