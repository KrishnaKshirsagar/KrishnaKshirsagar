import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CURRENCY_FORMAT, DATE_FORMAT } from 'src/app/shared/constants/constants';
import { ApiService } from '../../../services/api/api.service';

@Component({
  selector: 'app-cn-history-dailog',
  templateUrl: './cn-history-dailog.component.html',
  styleUrls: ['./cn-history-dailog.component.scss']
})
export class CnHistoryDailogComponent {
  
  currency_format = CURRENCY_FORMAT;

  date_format = DATE_FORMAT + ' hh:mm a';

  displayedColumns: string[] =
   [
    'amount_credit_note', 
    'upload_date', 
    'settlement_date', 
    'invoice_settled_for',
    'setteled_amount'
   ];
 
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
  ) {
     this.credit_note_history(data._id);
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  credit_note_history(cn_id : any){
       this.apiService.credit_note_history(cn_id).subscribe((res:any)=>{
          if (res.status == true) {
            this.dataSource = new MatTableDataSource (res.invoice_details);
            this.dataSource.paginator = this.paginator;
          }
          else
          {
            this.dataSource = new MatTableDataSource ();
          }
           
       })
  }
}
