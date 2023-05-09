import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialExampleModule } from "../../material.module";
import { StaffmanagementRoutingModule } from "./staffmanagement-routing.module";
import { CoreModule } from "../../core/core.module";
import {
  StafflistComponent,
  StaffinviteDialog,
  AddEditStaffDialog,
} from "./pages/stafflist/stafflist.component";
import { MatTableExporterModule } from "mat-table-exporter";
import { MatFormFieldModule } from "@angular/material/form-field";
import { StaffmanagementErrorComponent } from "./pages/components/staffmanagement-error/staffmanagement-error.component";
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
@NgModule({
  declarations: [
    StafflistComponent,
    StaffinviteDialog,
    AddEditStaffDialog,
    StaffmanagementErrorComponent,
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
    StaffmanagementRoutingModule,
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
export class StaffmanagementModule {}
