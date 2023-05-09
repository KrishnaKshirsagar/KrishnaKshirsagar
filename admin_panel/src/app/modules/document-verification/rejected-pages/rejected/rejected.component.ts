import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api/api.service';

@Component({
  selector: 'app-approved',
  templateUrl: './rejected.component.html',
  styleUrls: ['./rejected.component.scss']
})
export class RejectedComponent implements OnInit {

  buzdetails:any

  dataSource= new MatTableDataSource;

  company_Name!: any;
  companyNameControl = new FormControl("");
  
  displayedColumns:string[] =[
    "merchant_name",
    "anchor_name",
    "gst_in",
    "kyc_doc_pending",
    "bus_doc_pending",   
  ]

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private apiservice: ApiService){}

  openDoc(element:any){
    this.router.navigate(["approved_document"]);
        
  }
  ngOnInit(){

    this.get_rejected_details();

  }

  get_rejected_details(){

    this.apiservice.getRejectedDocuments().subscribe((response:any)=>{
      if(response.status==true && response.code==200){
        const ApprovedData = response.data;

        this.buzdetails=ApprovedData;

        this.dataSource= new MatTableDataSource(ApprovedData)
        this.dataSource.filterPredicate = function (ApprovedData:any,filter) {
          return ApprovedData.company_name.trim().toLowerCase().indexOf(filter)!=-1;
       }
        this.dataSource.paginator= this.paginator;
        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "company_name", direction: "asc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
        
      }
    })

  }
  applyFilterById(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
}
clear(ctrl: FormControl) {
  ctrl.setValue("");
  this.company_Name = "";
  this.get_rejected_details();
}

}
