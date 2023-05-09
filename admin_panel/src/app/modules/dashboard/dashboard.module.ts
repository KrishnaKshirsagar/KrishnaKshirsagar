import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module'
import { ApiService } from '../dashboard/services/api/api.service';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CoreModule } from 'src/app/core/core.module';
import { MatIconModule } from '@angular/material/icon';

import {  HighchartsChartModule } from 'highcharts-angular';
import { MaterialExampleModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from 'src/app/shared/shared.module';
import { AgmCoreModule } from '@agm/core';

import {MatAutocompleteModule} from '@angular/material/autocomplete';




@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    CoreModule,
    MaterialExampleModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    DashboardRoutingModule,
    MatTableExporterModule,
    SharedModule,
    FormsModule,
    MatTableModule,
    MatAutocompleteModule,
    HighchartsChartModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCe-et0QqaJyXuwIvcfdAfSG97sVVTxNVA'
    })
  ],
  providers: [ApiService],
})
export class DashboardModule {}
