import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialExampleModule } from "../../material.module";
import { CoreModule } from "../../core/core.module";
import { MatTableExporterModule } from "mat-table-exporter";
import { MatFormFieldModule } from "@angular/material/form-field";
import {
  AddEditUserDialog,
  UserlistComponent,
} from "./pages/userlist/userlist.component";
import { UsermanagementErrorComponent } from "./pages/components/usermanagement-error/usermanagement-error.component";
import { UsermanagementRoutingModule } from "./usermanagement-routing.module";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ApiService } from "./services/api/api.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DeleteDailogComponent } from "./pages/components/delete-dailog/delete-dailog.component";
import { MAT_DATE_LOCALE } from "@angular/material/core";
@NgModule({
  declarations: [
    UserlistComponent,
    AddEditUserDialog,
    UsermanagementErrorComponent,
    DeleteDailogComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    MaterialExampleModule,
    MatFormFieldModule,
    UsermanagementRoutingModule,
    MatTableExporterModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    ApiService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
  ],
})
export class UsermanagementModule {}
