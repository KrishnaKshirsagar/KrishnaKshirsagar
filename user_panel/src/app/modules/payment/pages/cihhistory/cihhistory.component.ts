import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { ApiService } from "../../services/api/api.service";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
} from "src/app/shared/constants/constants";
import { formatDate } from "@angular/common";
@Component({
  selector: "app-cihhistory",
  templateUrl: "./cihhistory.component.html",
  styleUrls: ["./cihhistory.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class CIHhistoryComponent implements AfterViewInit {

  companyid!: string;

  Date_Format = DATE_FORMAT;

  currency_format = CURRENCY_FORMAT;

  maxDate!: Date;

  changeText: boolean = false;

  value = "";

  companySelect: FormControl = new FormControl();

  displayedColumns: string[] = [
    "tansaction_id",
    "invoice_number",
    "company_name",
    "createdAt",
    "order_amount",
    "order_status",
  ];
  dataSource = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  invoice_number: any;
  filterInvoiceDate: any;
  filterPaymentDate: any;
  seller_id: any;
  companyList: any[];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  redirect!: string;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
    });

    const cid = sessionStorage.getItem("companyid");
    if (cid && cid != undefined && cid != null) {
      this.companyid = cid;
    }
    this.getPaymentHistory();
    this.maxDate = new Date();
  }

  getPaymentHistory() {    
    let filterdata:any = {} 
      if (this.invoice_number) {
        filterdata.invoice_number = this.invoice_number;
      }
      if (this.filterInvoiceDate) {
        filterdata.invoice_date = this.filterInvoiceDate;
      }
      if (this.filterPaymentDate) {
        filterdata.payment_date = this.filterPaymentDate;
      }
      if (this.seller_id) {
         filterdata.seller = this.seller_id;
      }

    this.apiService
      .getCIHHistory(this.companyid,filterdata)
      .subscribe((response: any) => {
        if (response.status == true) {
          this.dataSource = new MatTableDataSource(response.cih_history);
          this.dataSource.paginator = this.paginator;

          this.dataSource.sort = this.sort;
          const sortState: Sort = { active: "createdAt", direction: "desc" };
          this.sort.active = sortState.active;
          this.sort.direction = sortState.direction;
          this.sort.sortChange.emit(sortState);
        }
        else{
          this.dataSource = new MatTableDataSource();
        }
      });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  invoiceDate! : Date;

  paymentDate! : Date;

  invoicedate() {
    this.filterInvoiceDate = formatDate(this.invoiceDate, 'yyyy-MM-dd', 'en-US');
    this.getPaymentHistory();
  }

  paymentdate() {
    this.filterPaymentDate = formatDate(this.paymentDate, 'yyyy-MM-dd', 'en-US');
    this.getPaymentHistory();
  }

  filterInvoiceNo(invoice_number:any){
    this.invoice_number = (invoice_number.target as HTMLInputElement).value.trim().toUpperCase();
    this.getPaymentHistory();
  }
  
  // company search
  companySuggetion(event:any){ 
    const filterValue = (event.target as HTMLInputElement).value;
    if(filterValue.length > 2){
      let companyName = filterValue.toLocaleUpperCase().trim();
      this.apiService.companynameAutoSuggestion(companyName).subscribe((res)=>{
        this.companyList = [...res.companies];      
      })
    }
  }
  
  displayFn(company: any): string {
    return company && company.company_name ? company.company_name : '';
  }
  
  getPosts(companyid:any){ //Send sellerid to backend for filter
    this.seller_id = companyid._id;
    this.getPaymentHistory();
  }
  // clear search boxes
  
  sellerName = new FormControl
  invoiceNumber = new FormControl

  company_name_clear(ctrl:FormControl){
    ctrl.setValue('');
    this.seller_id = '';
    this.getPaymentHistory();
  }

  invoice_number_clear(ctrl:FormControl){
    ctrl.setValue('');
    this.invoice_number = '';
    this.getPaymentHistory();
  }
}
