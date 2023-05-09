import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PasswordStrengthMeterModule } from "angular-password-strength-meter";
import { SharedModule } from "src/app/shared/shared.module";
import { CoreModule } from "src/app/core/core.module";
import { ApiService } from "./services/api/api.service";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFileUploadModule } from "angular-material-fileupload";
import { MatTableExporterModule } from "mat-table-exporter";
import { MatRadioModule } from "@angular/material/radio";
import { PaymentStatus } from "./pages/paymentstatus.component";
import { PaymentstatusRoutingModule } from "./paymentstatus-routing.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { EMandateStatus } from "./pages/eMandateStatus/eMandatestatus.component";
@NgModule({
  declarations: [PaymentStatus, EMandateStatus],
  imports: [
    CommonModule,
    MatFileUploadModule,
    CoreModule,
    FormsModule,
    MatFormFieldModule,
    MatRadioModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    PasswordStrengthMeterModule,
    SharedModule,
    MatGridListModule,
    MatTableExporterModule,
    PaymentstatusRoutingModule,
    MatSnackBarModule,
  ],
  providers: [ApiService],
})
export class PaymentStatusModule {}
