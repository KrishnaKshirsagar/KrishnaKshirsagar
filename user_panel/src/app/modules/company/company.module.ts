import { NgModule } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PasswordStrengthMeterModule } from "angular-password-strength-meter";
import { CompanyRoutingModule } from "./company-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { CoreModule } from "src/app/core/core.module";
import { ApiService } from "./services/api/api.service";
import { CompanyErrorComponent } from "./pages/components/company-error/company-error.component";
import { UsersComponent, AddUsersDialog } from "./pages/users/users.component";
import { CompanylistComponent } from "./pages/companylist/companylist.component";
import {
  BankaccountComponent,
  AddBankaccountDialog,
} from "./pages/bankaccount/bankaccount.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatRadioModule } from "@angular/material/radio";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ConformDailogComponent } from "./pages/components/conform-dailog/conform-dailog.component";
import { MatCommonModule } from "@angular/material/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { CreditComponent } from "./pages/credit/credit.component";
import { KycComponent } from './pages/kyc/kyc.component';
import { UsersdashboardComponent, UsersdashboardDialog } from "./pages/usersdashboard/usersdashboard.component";
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CompanydetailsComponent, CompanydetailseditDialog } from "./pages/companydetails/companydetails.component";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { FlatpickrModule } from "angularx-flatpickr";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AssociatedEntitiesComponent } from "./pages/associated-entities/associated-entities.component";
import { MatTableExporterModule } from "mat-table-exporter";
import { KycDocDailogComponent } from './pages/components/kyc-doc-dailog/kyc-doc-dailog.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    UsersComponent,
    BankaccountComponent,
    CompanylistComponent,
    CompanydetailsComponent,
    CompanydetailseditDialog,
    CompanyErrorComponent,
    AddUsersDialog,
    UsersdashboardComponent,
    UsersdashboardDialog,
    AddBankaccountDialog,
    ConformDailogComponent,
    CreditComponent,
    KycComponent,
    AssociatedEntitiesComponent,
    KycDocDailogComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    PasswordStrengthMeterModule,
    SharedModule,
    CompanyRoutingModule,
    MatSnackBarModule,
    MatGridListModule,
    MatRadioModule,
    MatCommonModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatTableExporterModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    HttpClientModule
  ],
  providers: [
    ApiService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
    CurrencyPipe
  ],
})
export class CompanyModule {}
