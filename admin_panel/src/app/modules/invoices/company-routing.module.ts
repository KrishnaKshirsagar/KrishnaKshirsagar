import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellerinvoicesComponent } from './pages/sellerinvoices/sellerinvoices.component';
import { BuyerinvoicesComponent } from './pages/buyerinvoices/buyerinvoices.component';
import { InvoicesdetailsComponent } from './pages/invoicesdetails/invoicesdetails.component';
import { UploadinvoicesComponent } from './pages/uploadinvoices/uploadinvoices.component';

const routes: Routes = [
  { path: '', component: BuyerinvoicesComponent },
  { path: '', redirectTo: '/invoices/buyerinvoices', pathMatch: 'full' },
  // { path: 'sellerinvoices', component: SellerinvoicesComponent },
  { path: 'buyerinvoices', component: BuyerinvoicesComponent },
  { path: 'invoicesdetails', component: InvoicesdetailsComponent },
  { path: 'uploadinvoices', component: UploadinvoicesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoicesRoutingModule {}
