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
import { CURRENCY_FORMAT, DATE_FORMAT } from 'src/app/shared/constants/constants';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-receivables-ageing-by-invoice',
  templateUrl: './receivables-ageing-by-invoice.component.html',
  styleUrls: ['./receivables-ageing-by-invoice.component.scss']
})
export class ReceivablesAgeingByInvoiceComponent implements OnInit {

  currency_format = CURRENCY_FORMAT;

  date_format = DATE_FORMAT;

  redirect!: string;

  anchorSelect = new FormControl();

  nbfcSelect = new FormControl();

  dealer = new FormControl();

  company_Name!: any[];

  maxDate!: Date;

  as_no_date!: any;

  displayedColumns: string[] = [
    "dealer_name",
    "dealer_gstin",
    "retailer_mobile",
    "anchor_name",
    "anchor_gstin",
   
    // "finacing_partner",
    "loan_date",
    "Due_on",
    "Document_id",
    "0_to_30",  
    "30_to_60",
    "60_to_90",    
    "90_to_120",
    "overdue_0_to_30",
    "overdue_30_to_60",
    "overdue_60_to_90",
    "overdue_90_to_120"  
  ];

  dataSource = new MatTableDataSource([]);
  anchor_id: any;
  dealer_id: any;

  
  filterInvoiceByDate: any;
  nbfc_name!: any[];
  nbfc_id: any;
  durationInSeconds = 2;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private snackBar : MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
    });
    this.maxDate = new Date();
    this.ageing_by_invoice();
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
  
  //  ageing_by_invoice
  ageing_by_invoice(){
    let filter:any = {}

    if (this.filterInvoiceByDate !=undefined && this.filterInvoiceByDate !="") {
      filter.as_on_date =  this.filterInvoiceByDate;
   }
  
   if ((this.anchor_id !== undefined || this.anchor_id !=="")){
      filter.anchor_id = this.anchor_id;
    }
  
    if ((this.dealer_id !== undefined || this.dealer_id !=="")){
      filter.dealer_id = this.dealer_id;
    }

    if ( this.nbfc_id !== undefined ||  this.nbfc_id !=="") {
      filter.nbfc_id =  this.nbfc_id;
    }

    this.apiService.ageing_by_invoice(filter).subscribe((res:any)=>{
       if (res.status == true) {
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
       } else {
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

  // displayFn
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
      this.ageing_by_invoice();
    }
  }

   // get dealer id
  getDealerId(companyid: any) {
    this.dealer_id = companyid._id;
    if ((this.dealer_id !== undefined || this.dealer_id !=="")){
      //this.userType = "dealer";
      this.ageing_by_invoice();
    }
  }

  // nbfc id
  nbfcId(nbfcid:any){
    this.nbfc_id = nbfcid._id;
    this.ageing_by_invoice();
}

  // as_On_Date
  as_On_Date() {
    this.filterInvoiceByDate = formatDate(
      this.as_no_date,
      "yyyy-MM-dd",
      "en-US"
    );
    this.ageing_by_invoice();
  }

  //clear boxes
  anchor_clear(ctrl : FormControl){
    this.company_Name = [];
    ctrl.setValue("");
    this.anchor_id = "";
    this.ageing_by_invoice();
  }

  dealer_clear(ctrl : FormControl){
    this.company_Name = [];
    ctrl.setValue("");
    this.dealer_id = "";
    this.ageing_by_invoice();
  }

  nbfc_clear(ctrl : FormControl){
    this.nbfc_name = [];
    ctrl.setValue("");
    this.nbfc_id = "";
    this.ageing_by_invoice();
  }

  date_cancle(date : any){
    if (date == "as_on_date") {
      this.filterInvoiceByDate = "";
      this.as_no_date = "";
      this.ageing_by_invoice();
    } 
 }
}
