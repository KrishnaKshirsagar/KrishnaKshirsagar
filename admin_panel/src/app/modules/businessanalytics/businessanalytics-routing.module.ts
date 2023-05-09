import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CustomerSingleViewComponent } from './pages/customer-single-view/customer-single-view.component'

const routes: Routes = [
  { path: "", component: CustomerSingleViewComponent, pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessanalyticsRoutingModule {}
