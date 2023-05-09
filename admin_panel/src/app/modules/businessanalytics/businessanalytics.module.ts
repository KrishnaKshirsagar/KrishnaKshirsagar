import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerSingleViewComponent } from './pages/customer-single-view/customer-single-view.component';
import { BusinessanalyticsRoutingModule } from './businessanalytics-routing.module'
import { ApiService } from '../businessanalytics/services/api/api.service';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CoreModule } from 'src/app/core/core.module';
import { MatIconModule } from '@angular/material/icon';
import { MaterialExampleModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from 'src/app/shared/shared.module';
import { AgmCoreModule } from '@agm/core';
import * as CanvasJSAngularChart from 'src/assets/canvasjs-3.7.5/canvasjs.angular.component';
import { MatDialogModule } from '@angular/material/dialog';


var CanvasJSChart = CanvasJSAngularChart.CanvasJSChart;
@NgModule({
  declarations: [CustomerSingleViewComponent, CanvasJSChart],
  imports: [
    CommonModule,
    CoreModule,
    MaterialExampleModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    BusinessanalyticsRoutingModule,
    MatTableExporterModule,
    SharedModule,
    MatDialogModule,
    FormsModule,
    MatTableModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCe-et0QqaJyXuwIvcfdAfSG97sVVTxNVA'
    })
  ],
  providers: [ApiService],
})
export class BusinessanalyticsModule {}
