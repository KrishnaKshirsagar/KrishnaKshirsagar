import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialExampleModule } from "../../material.module";
import { CollectionRoutingModule } from "./collection-routing.module";
import { CoreModule } from "../../core/core.module";
import {
  OverDueInvoicesComponent,
  CommentsHistoryDialog,
} from "./pages/over-due-invoices/over-due-invoices.component";
import { MatTableExporterModule } from "mat-table-exporter";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CollectionErrorComponent } from "./pages/components/collection-error/collection-error.component";
import { ApiService } from "./services/api/api.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { DeleteDailogComponent } from "./pages/components/delete-dailog/delete-dailog.component";
import {
  MappingComponent,
  MappingDialog,
  StaffmappingDialog,
} from "./pages/mapping/mapping.component";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import {
  InvoiceWaiverDialog,
  ManageCollectionComponent,
} from "./pages/manage-collection/manage-collection.component";
@NgModule({
  declarations: [
    OverDueInvoicesComponent,
    CommentsHistoryDialog,
    InvoiceWaiverDialog,
    ManageCollectionComponent,
    CollectionErrorComponent,
    DeleteDailogComponent,
    MappingComponent,
    MappingDialog,
    StaffmappingDialog,
  ],
  imports: [
    CommonModule,
    CoreModule,
    MaterialExampleModule,
    MatFormFieldModule,
    CollectionRoutingModule,
    MatTableExporterModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormsModule,
  ],
  providers: [
    ApiService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
  ],
})
export class CollectionModule {}
