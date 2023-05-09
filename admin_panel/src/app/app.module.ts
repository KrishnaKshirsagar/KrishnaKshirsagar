import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CoreModule } from "./core/core.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SharedModule } from "./shared/shared.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MaterialExampleModule } from "./material.module";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CompanyRoutingModule } from "./modules/company/company-routing.module";
import { MatTableExporterModule } from "mat-table-exporter";
import { MatDialogRef } from "@angular/material/dialog";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "src/environments/environment.prod";
import { AgmCoreModule } from "@agm/core";
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from "ng-recaptcha";
import { MatSortModule } from "@angular/material/sort";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    // ServiceWorkerModule.register('ngsw-worker.js', {
    //   enabled: environment.production,
    //   // Register the ServiceWorker as soon as the app is stable
    //   // or after 30 seconds (whichever comes first).
    //   registrationStrategy: 'registerWhenStable:30000',
    // }),

    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    CoreModule,
    SharedModule,
    RecaptchaV3Module,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCe-et0QqaJyXuwIvcfdAfSG97sVVTxNVA'
    })
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKey,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
