import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialExampleModule } from '../../material.module';
import { CoreModule } from '../../core/core.module';
import {
  SellerinvoicesComponent,
  SellerinvoicesDialog,
} from "./pages/sellerinvoices/sellerinvoices.component";
import {
  CreditplanswitchDialog,
  InvoicesdetailsComponent,
  InvoicesdetailsdeleteDialog,
} from "./pages/invoicesdetails/invoicesdetails.component";
import { MatTableExporterModule } from "mat-table-exporter";
import { MatFormFieldModule } from "@angular/material/form-field";
import { InvoicesRoutingModule } from "./company-routing.module";
import {
  AddInvoice,
  BuyerinvoicesComponent,
  BuyerinvoicesDialog,
  CreditNoteSettlement,
} from "./pages/buyerinvoices/buyerinvoices.component";
import {
  UploadinvoicesComponent,
  UploadinvoicesdeleteDialog,
} from "./pages/uploadinvoices/uploadinvoices.component";
import { MatFileUploadModule } from "angular-material-fileupload";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { CommentHistoryDailogComponent } from './pages/components/comment-history-dailog/comment-history-dailog.component';
import { AuditTrailComponent } from './pages/components/audit-trail/audit-trail.component';
import { CnHistoryDailogComponent } from './pages/components/cn-history-dailog/cn-history-dailog.component';
@NgModule({
  declarations: [
    SellerinvoicesComponent,
    BuyerinvoicesComponent,
    BuyerinvoicesDialog,
    CreditNoteSettlement,
    AddInvoice,
    InvoicesdetailsComponent,
    SellerinvoicesDialog,
    InvoicesdetailsdeleteDialog,
    UploadinvoicesComponent,
    UploadinvoicesdeleteDialog,
    CreditplanswitchDialog,
    CommentHistoryDailogComponent,
    AuditTrailComponent,
    CnHistoryDailogComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    MaterialExampleModule,
    MatFormFieldModule,
    InvoicesRoutingModule,
    MatTableExporterModule,
    MatFileUploadModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
  ],
})
export class InvoicesModule {}
