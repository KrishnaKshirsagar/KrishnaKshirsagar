import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../services/api/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DATE_FORMAT } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-show-upload-history',
  templateUrl: './show-upload-history.component.html',
  styleUrls: ['./show-upload-history.component.scss']
})
export class ShowUploadHistoryComponent implements OnInit {

  displayedColumns: string[] = [
    "file_url",
    "createdBy",
    "createdAt",
  ];

  date_format = DATE_FORMAT + 'h:mm:ss a';

  dataSource = new MatTableDataSource([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService : ApiService
  ){
     this.show_uploaded_history(data)
  }

  show_uploaded_history(seller_id : any) {
    this.apiService.show_uploaded_history(seller_id).subscribe((res : any)=>{
         if (res.status == true) {
          this.dataSource = new MatTableDataSource (res.message);
          this.dataSource.paginator = this.paginator;
         }
         else
         {
          this.dataSource = new MatTableDataSource ([]);
         }
         
    })
  }

  ngOnInit(){
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
