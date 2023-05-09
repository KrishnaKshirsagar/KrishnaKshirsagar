import { LiveAnnouncer } from '@angular/cdk/a11y';
import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CURRENCY_FORMAT } from 'src/app/shared/constants/constants';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-receivablesageing',
  templateUrl: './receivablesageing.component.html',
  styleUrls: ['./receivablesageing.component.scss']
})
export class ReceivablesageingComponent implements OnInit {

 currency_format = CURRENCY_FORMAT;

 nbfcSelect = new FormControl();

 redirect!: string;

 maxDate!: Date;

 as_no_date!: any;


  displayedColumns: string[] = [
    "dealer_name",
    "overdue_90_to_120",
    "overdue_60_to_90",
    "overdue_30_to_60",
    "overdue_0_to_30",
    "90_to_120",
    "60_to_90",
    "30_to_60",
    "0_to_30"
  ];

  dataSource = new MatTableDataSource([]);
  
  company_Name!: any[];
  anchor_id: any;
  dealer_id: any;
  filterInvoiceByDate: any;
  durationInSeconds = 2;
  nbfc_id: any;
  nbfc_name!: any[];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private snackBar : MatSnackBar
  ) { }

  anchorSelect = new FormControl();

  dealer = new FormControl();

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
    });
    this.snackBar.open("Please select As On date for report", "Close", {
      duration: this.durationInSeconds * 3000,
      panelClass: ["error-dialog"],
    });
    this.maxDate = new Date();
    this.ageing_report();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  @ViewChild(MatSort) sort!: MatSort;

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }


  ageing_report(){
    let filter:any = {}

    if (this.filterInvoiceByDate !=undefined && this.filterInvoiceByDate !="") {
       filter.as_on_date =  this.filterInvoiceByDate;
    }
   
    if ((this.anchor_id !== undefined || this.anchor_id !=="")){
       filter.anchor_id = this.anchor_id;
    }

    if ( this.nbfc_id !== undefined ||  this.nbfc_id !=="") {
      filter.nbfc_id =  this.nbfc_id;
    }

    this.apiService.ageing_report(filter).subscribe((res:any)=>{
      if (res.status == true) {
         this.dataSource = new MatTableDataSource(res.result);
         this.dataSource.paginator = this.paginator;
      }
      else{
        this.dataSource = new MatTableDataSource([]);
      }
      
    })
  }

  // ========= dropdwon and auto suggetion =======
  companySuggetion(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length > 2) {
      let companyName = filterValue.toUpperCase();
      this.apiService
        .companynameAutoSuggestion(companyName)
        .subscribe((res) => {
          this.company_Name = [...res.companies];
        });
    }
  }

  // nbfc auto suggestion
  nbfcAutoSuggestion(event : any){
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length > 2) {
      let companyName = filterValue.toUpperCase();
      this.apiService
        .nbfcAutoSuggestion(companyName)
        .subscribe((res) => {
          this.nbfc_name = [...res.get_nbfc];
       });
    }
  }
  
  displayFn(company: any): string {
    return company && company.company_name ? company.company_name : "";
  }

  displayNbfc(nbfc: any): string { 
    return nbfc && nbfc.nbfc_name ? nbfc.nbfc_name : "";
  }

   // get Anchor Id
   getAnchorId(companyid: any) {
    this.anchor_id = companyid._id;
    if ((this.anchor_id !== undefined || this.anchor_id !=="")){
     // this.userType = "anchor";
      this.ageing_report();
    }
  }

  // get dealer id
  getDealerId(companyid: any) {
    this.dealer_id = companyid._id;
    if ((this.dealer_id !== undefined || this.dealer_id !=="")){
      //this.userType = "dealer";
      //this.getReceivableStatement();
    }
  }

  // nbfc id
  nbfcId(nbfcid:any){
    this.nbfc_id = nbfcid._id;
    this.ageing_report();
}
 
  // As On Date

  as_On_Date() {
    this.filterInvoiceByDate = formatDate(
      this.as_no_date,
      "yyyy-MM-dd",
      "en-US"
    );
    this.ageing_report();
  }

   // clear input boxes
   anchor_clear(ctrl : FormControl){
    this.company_Name = [];
    ctrl.setValue("");
    this.anchor_id = "";
    this.ageing_report();
  }

  dealer_clear(ctrl : FormControl){
    this.company_Name = [];
    ctrl.setValue("");
    // this.dealer_id = "";
    // this.getReceivableStatement();
  }

  nbfc_clear(ctrl : FormControl){
    this.nbfc_name = [];
    ctrl.setValue("");
    this.nbfc_id = "";
    this.ageing_report();
  }

  date_cancle(date : any){
    if (date == "as_on_date") {
      this.filterInvoiceByDate = "";
      this.as_no_date = "";
      this.ageing_report();
    } 
 }
}
