import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PasswordStrengthMeterModule } from "angular-password-strength-meter";
import { PaymentRoutingModule } from "./payment-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { CoreModule } from "src/app/core/core.module";
import { ApiService } from "./services/api/api.service";
import { PaymentErrorComponent } from "./pages/components/payment-error/payment-error.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatFileUploadModule } from "angular-material-fileupload";
import { MatTableExporterModule } from "mat-table-exporter";
import { MatRadioModule } from "@angular/material/radio";
import { ExtendCreditComponent } from "./pages/components/extend-credit/extend-credit.component";
import { MatInputModule } from "@angular/material/input";
import { PaynowDialogComponent } from "./pages/components/pay-now/paynow.component";
import { PaymenthistoryComponent } from "./pages/paymenthistory/paymenthistory.component";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { MatNativeDateModule, MAT_DATE_LOCALE } from "@angular/material/core";
import { BulkpayDialogComponent } from "./pages/components/bulk-pay/bulkpay.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { PaymentSummeryComponent } from "./pages/components/payment-summery/payment-summery.component";
import { CIHhistoryComponent } from "./pages/cihhistory/cihhistory.component";

@NgModule({
  declarations: [
    PaymentErrorComponent,
    PaymenthistoryComponent,
    CIHhistoryComponent,
    ExtendCreditComponent,
    PaynowDialogComponent,
    BulkpayDialogComponent,
    PaymentSummeryComponent
  ],
  imports: [
    CommonModule,
    MatFileUploadModule,
    CoreModule,
    FormsModule,
    MatFormFieldModule,
    MatRadioModule,
    ReactiveFormsModule,
    PasswordStrengthMeterModule,
    SharedModule,
    PaymentRoutingModule,
    MatGridListModule,
    MatTableExporterModule,
    MatInputModule,
    AutocompleteLibModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [ApiService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
})
export class PaymentModule {}
