import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentVerificationRoutingModule } from './document-verification-routing.module';
import { ApprovedComponent } from './approved-pages/approved/approved.component';
import { PendingComponent } from './pending-pages/pending/pending.component';
import { KycDocumentComponent } from './pending-pages/kyc-document/kyc-document.component';
import { BusinessDocumentComponent } from './pending-pages/business-document/business-document.component';
import { FilesDialogComponent } from './components/files-dialog/files-dialog.component';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { DocVerficationDashboardComponent } from './doc-verfication-dashboard/doc-verfication-dashboard.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RejectedComponent } from './rejected-pages/rejected/rejected.component';


@NgModule({
  declarations: [
    ApprovedComponent,
    PendingComponent,
    KycDocumentComponent,
    BusinessDocumentComponent,
    FilesDialogComponent,
    DocVerficationDashboardComponent,
    RejectedComponent
  ],
  imports: [
    CommonModule,
    DocumentVerificationRoutingModule,
    CoreModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatExpansionModule,
    MatCardModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSortModule,
    MatTooltipModule,
    FormsModule,
    MatFormFieldModule,
   MatInputModule


  ]
})
export class DocumentVerificationModule { }