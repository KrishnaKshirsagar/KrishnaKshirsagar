import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationExtras, Router } from '@angular/router';
import { ApiService } from '../../service/api/api.service';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.scss']
})
export class PendingComponent implements OnInit {

  // dataSource = new MatTableDataSource();

  sum:number=0;
  
  
  dataSource= new MatTableDataSource();

  company_Name!: any;
  companyNameControl = new FormControl("");
  
  displayedColumns:string[] =[
    // "sl_no",
    "merchant_name",
    "anchor_name",
    "gst_in",
    "kyc_doc_pending",
    "bus_doc_pending",
    "action",
    
  ]

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router,
    private apiservice: ApiService,
    private snackbar:MatSnackBar){}

  openKYC(element:any){
    const gst=element.gstin;
    const companyId = element.companyId;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        companyid: JSON.stringify(companyId),
      },
    };
if(companyId && gst){
  this.router.navigate([`admin/document-verification/kyc_document/${companyId}`]);
}else{
  this.snackbar.open("Company ID and GST is invalid","Close", {
    duration: 3000
  })
}
        
  }

  ngOnInit(){
    this.getpendingdocument();
  }

  getpendingdocument() {
    
    
    this.apiservice.getPendingDocuments().subscribe((response: any) => {
     
      if (response.code == 200) {  
        const pendingDocuments = response.data ? response.data : [];
      
        this.dataSource = new MatTableDataSource(pendingDocuments)
        this.dataSource.filterPredicate = function (pendingDocuments:any,filter) {
          return pendingDocuments.company_name.trim().toLowerCase().indexOf(filter)!=-1;
       }
      //  for (let i=0;i<pendingDocuments.length;i++){
      //   this.buyerList[i]=pendingDocuments[i].company_name
      //  }

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
    this.getpendingdocument();
  }

}
