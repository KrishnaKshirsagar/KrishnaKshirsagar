import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { ApiService } from "../../services/api/api.service";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { InvoiceErrorComponent } from "../components/invoice-error/invoice-error.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { ExtendCreditComponent } from "src/app/modules/payment/pages/components/extend-credit/extend-credit.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PaynowDialogComponent } from "src/app/modules/payment/pages/components/pay-now/paynow.component";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
} from "src/app/shared/constants/constants";
import { FormControl } from "@angular/forms";
import { BulkpayDialogComponent } from "src/app/modules/payment/pages/components/bulk-pay/bulkpay.component";

@Component({
  selector: "app-invoicelist",
  templateUrl: "./invoicelist.component.html",
  styleUrls: ["./invoicelist.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class InvoicelistComponent implements AfterViewInit {  

  Date_Format = DATE_FORMAT;

  currency_Format = CURRENCY_FORMAT;

  companySelect: FormControl = new FormControl();

  displayedColumns: string[] = [
    "invoice_no",
    "company_name",
    "invoice_date",
    "invoice_amount",
    "total_tax",
    // "extended_due_date",
    "outstanding_amount",
    "discount",
    "interest",
    "payable_amount",
    "invoice_due_date",
    "invoice_status",
    "createdAt",
    "actions",
  ];

  dataSource = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  redirect!: string;

  private token!: string;

  private durationInSeconds = 2;

  changeText: boolean = false;

  data = []

  extendCreditFlag: boolean = false;

  companyid!: string;
  invoice_due_in: any;
  invoice_status: any;
  selectedCompanyId: any;
  companyList!: any[];
  invoiceStatusSelection = '';
  invoice_due = '';
  userType = "seller";  

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<InvoiceErrorComponent>,
    public dialogRef1: MatDialogRef<ExtendCreditComponent>

  ) {  }

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
    this.getInvoiceByCompanyId();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDialog1() {
    // const dialogRef = this.dialog.open(PurchasedashboardDialog);
  }

  checkExtendCredit(element: any){
    var today = new Date();
    var due_date = new Date(element.invoice_due_date); //Due date
    var extended_date = new Date(element.extended_due_date);
    var today = new Date(today); //Today's/current date
    var Time1 = due_date.getTime() - today.getTime(); //today - due date
    var Days1 = +(Time1 / (1000 * 3600 * 24)).toFixed(2); //Diference in todays  and due date

    var Time2 = extended_date.getTime() - due_date.getTime(); //extend - due date
    var Days2 = +(Time2 / (1000 * 3600 * 24)).toFixed(2);

    if (Days1 < 3 && Days1 >= 0) {
      return true
    } else {
      return false
    }
  }

  openInvoicePage(mode: string) {
    if (mode == "sales") {
      this.router.navigate([`/companies/${this.companyid}/invoices/sales`]);
    } else {
      this.router.navigate([`/companies/${this.companyid}/invoices/purchases`]);
    }
  }
  // get Part Pay invoice status
  getstatus(status: string):any {
    if(status == "Partpay"){
      return status = "Part Pay";
    } 
    else
    {
      return status = status;
    }
  }

  getInvoiceByCompanyId() {
    const body = {
      type: "buyer",
      id: this.companyid,
    };
    this.apiService.getInvoicesByCompanyId(body).subscribe((response: any) => {
      if (response.status == true) {
        this.data = response.invoice;
        // this.dataSource = new MatTableDataSource(response.invoice);
        // this.dataSource.paginator = this.paginator;

        // this.dataSource.sort = this.sort;
        // const sortState: Sort = { active: "createdAt", direction: "desc" };
        // this.sort.active = sortState.active;
        // this.sort.direction = sortState.direction;
        // this.sort.sortChange.emit(sortState);
      }
    });
  }

  getPayableAmount(element:any){
    const outstanding_amount = +(element && element.outstanding_amount ? element.outstanding_amount : 0);
    const interest = +(element && element.interest ? element.interest : 0);
    const discount = +(element && element.discount ? element.discount : 0);
    return (outstanding_amount + interest - discount);
  }

  uploadInvoices() {
    this.router.navigate([
      `/companies/${this.companyid}/invoices/invoiceupload`,
    ]);
  }

  viewInvoice(invoicelink: any) {
    if (invoicelink && invoicelink != "" && invoicelink != undefined) {
      window.location.href = invoicelink;
    } else {
      this.snackBar.open("Unable to download the invoice file.", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
  }

  openDialog(invoicedetails:any) { //change invoice status 
    this.dialogRef = this.dialog.open(InvoiceErrorComponent,{
      data: invoicedetails
    });

    this.dialogRef.afterClosed().subscribe((invoic_status_data) => {
      if(invoic_status_data != null && invoic_status_data != undefined){
        const invoiceStatus: any = {
          invoiceID: invoicedetails.invoiceid,
          status: invoicedetails.status, //'Rejected',
          user_comment: invoic_status_data.invoice_comment,
          user_consent_message: invoicedetails.status != 'Rejected' ? invoic_status_data.consent_msg : '',
          userConsentGiven: invoicedetails.status != 'Rejected' ?  invoic_status_data.userConsentGiven : false,
        };
        this.apiService
          .changeInvoiceStatus(invoiceStatus)
          .subscribe((resp: any) => {
            if (resp.status == true) {
              this.snackBar.open(
                "Invoice Status is changed successfully",
                "Close",
                {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                }
              );
              this.getInvoiceByCompanyId();
            } else {
              this.snackBar.open(
                "Unable to change the Invoice Status, Please try again after sometime",
                "Close",
                {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                }
              );
              this.getInvoiceByCompanyId();
            }
        });
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

  confirmInvoice(invoiceData: any) {
    let data = { 
      invoiceid:invoiceData._id,
      invoice_number:invoiceData.invoice_number,
      seller_name:invoiceData.seller.company_name,
      nbfc_name:invoiceData.nbfc_name,
      status:"Confirmed"
    }
    this.openDialog(data);
  }

  rejectInvoice(invoiceData: any) {
 let data = { 
      invoiceid:invoiceData._id,
      invoice_number:invoiceData.invoice_number,
      seller_name:invoiceData.seller.company_name,
      nbfc_name:invoiceData.nbfc_name,
      status:"Rejected"
    }
    this.openDialog(data);
  }

  extendCreditInvoice(invoiceData: any) {
    if (invoiceData.outstanding_amount < 0) {
      this.snackBar.open("You cannot apply, please check details.", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    } else {
      this.dialogRef1 = this.dialog.open(ExtendCreditComponent, {
        data: {
          invoice_id: invoiceData._id,
          companyid: this.companyid,
          invoice_number: invoiceData.invoice_number,
          seller_name: invoiceData.seller.company_name,
          sellerid: invoiceData.seller._id,
          invoice_due_date: invoiceData.invoice_due_date,
          extended_due_date: invoiceData && invoiceData.extended_due_date ? invoiceData.extended_due_date : invoiceData.invoice_due_date,
          invoice_amount: invoiceData.invoice_amount,
          outstanding_amount: invoiceData.outstanding_amount,
        },
      });

      this.dialogRef1.afterClosed().subscribe(() => {
        this.getInvoiceByCompanyId();
      })
    }
  }

  openBulkpayDialogue(){
    this.dialog.open(BulkpayDialogComponent, {
      data: {
        companyid: this.companyid,
      },
    });
  }

  payInvoice(invoiceData: any) {
    this.dialog.open(PaynowDialogComponent, {
      data: {
        companyid: this.companyid,
        invoiceData: invoiceData,
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //========= invoice filter ===========

  filterInvoices(){
    let filterdata:any = {};
    if (this.invoice_due_in) {
      filterdata.invoice_due_in = this.invoice_due_in;
    }
    if (this.invoice_status) {
      filterdata.invoice_status = this.invoice_status;
    }
    if (this.selectedCompanyId) {
      filterdata.companyid = this.selectedCompanyId;
    }
    filterdata.type = this.userType;

    const body = {
      type: "buyer",
      id: this.companyid,
    };
    
    this.apiService.filterInvoices( body, filterdata).subscribe((response:any)=>{
      if (response.status == true) {
        this.dataSource = new MatTableDataSource(response.invoice);
        this.dataSource.paginator = this.paginator;

        // this.sort.sort({ id: "createdAt", start: "desc" } as MatSortable);
        // this.dataSource.sort = this.sort;
        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "createdAt", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
      else{
        this.dataSource = new MatTableDataSource([]);
      }
    })
  }

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

  getPosts(companyid:any){
    this.userType = "seller"
    this.selectedCompanyId = companyid._id;
    this.filterInvoices();
  }

  invoiceDueIn(invoice_due_in:string ) {
    this.invoice_due_in = invoice_due_in;
    this.filterInvoices();
  }

  invoiceStatus(invoice_status: string) {
    this.invoice_status = invoice_status;
    this.filterInvoices(); 
  }
  
  company_name_clear(ctrl:FormControl){
    ctrl.setValue('');
    this.userType = '';
    this.selectedCompanyId = '';
    this.filterInvoices();
  }

}
