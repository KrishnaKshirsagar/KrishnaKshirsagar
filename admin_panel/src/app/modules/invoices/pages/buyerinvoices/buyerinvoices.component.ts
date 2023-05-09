import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ApiService } from '../../services/api/api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CURRENCY_FORMAT, DATE_FORMAT } from 'src/app/shared/constants/constants';
import { formatDate } from '@angular/common';
import { CommentHistoryDailogComponent } from '../components/comment-history-dailog/comment-history-dailog.component';
import { AuditTrailComponent } from '../components/audit-trail/audit-trail.component';
import { CnHistoryDailogComponent } from '../components/cn-history-dailog/cn-history-dailog.component';
@Component({
  selector: 'app-buyerinvoices',
  templateUrl: './buyerinvoices.component.html',
  styleUrls: ['./buyerinvoices.component.scss'],
  providers: [],
})
export class BuyerinvoicesComponent implements AfterViewInit {
  invoiceList:any;

  deleteButtonFlag:boolean = false;

  Date_Format = DATE_FORMAT;

  currency_format = CURRENCY_FORMAT;

  invoiceDate!: any;

  paymentDate!: Date;

  companySelect: FormControl = new FormControl();

  company_Name!: any;

  selection = "";

  gstuserselect = "";

  panuserselect = "";

  gstin!: string;

  maxDate!: Date;

  userType: any;

  filterdata: any = {};

  selectedCompanyId: any;

  deleteAll:FormControl = new FormControl();

  userid:any;

  displayedColumns: string[] = [
    "invoiceno",
    "invoice_type",
    "byuerCompany",
    "byuergstin",
    "selleCompany",
    "sellergstin",
    "invoice_date",
    "invoiceamount",
    "total_tax",
    "outstanding_amount",
    "disbursementdate",
    "disbursementamount",
    "invoiceduedate",
    "invoicestatus",
    "createdAt",
    "actions",
  ];

  dataSource = new MatTableDataSource([]);
  
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<BuyerinvoicesDialog>,
    public dialogRef2: MatDialogRef<CreditNoteSettlement>,
    private route : ActivatedRoute,
    private router: Router,
    private snackBar:MatSnackBar,
    private dialogRef1: MatDialogRef<CommentHistoryDailogComponent>,
  ) {}
  
  ngOnInit(): void {
    let obj : any = {}
    this.maxDate = new Date();
    this.userid = sessionStorage.getItem("LoginId");

    this.route.queryParams.subscribe((params) => {
       obj = JSON.parse(params["obj"]);
    });
    
    if (obj.seller_flag == false) {
      this.company_Name = [{
        company_name : obj.company_name
      }]
      this.companySelect.setValue({company_name: obj.company_name});
      this.selection = "buyer"
      this.filterdata.usertype = this.selection
      this.getPosts({_id : obj._id})
    }
    else if (obj.seller_flag == true) {
      this.company_Name = [{
        company_name : obj.company_name
      }]
      this.companySelect.setValue({company_name: obj.company_name});
      this.selection = "seller"
      this.filterdata.usertype = this.selection
      this.getPosts({_id : obj._id})
    }
    else{
      this.filterInvoices();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  disbursementStatus(disbursement_status:string){
    if (disbursement_status != undefined && disbursement_status != null) {
      this.filterdata.disbursement_status = disbursement_status;
      this.filterInvoices();
    }
  }
  getInvoices() {
    this.apiService.getInvoices().subscribe((resp: any) => {
      if (resp && resp.status == true) {
        const invoices = resp.invoice ? resp.invoice : [];
        this.dataSource = new MatTableDataSource(invoices);
        this.dataSource.paginator = this.paginator;

        // this.sort.sort(({ id: 'createdAt', start: 'desc'}) as MatSortable);
        // this.dataSource.sort = this.sort;

        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "createdAt", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    });
  }

  // get Invoice Status
  getstatus(status: string): any {
    if (status == "Partpay") {
      return (status = "Part Pay");
    } else {
      return (status = status);
    }
  }

  openDialog(element: any) {
    this.dialogRef = this.dialog.open(BuyerinvoicesDialog, {
      data: {
        invoiceDetail: element,
      },
    });

    this.dialogRef.afterClosed().subscribe(() => {
      this.filterInvoices();
    });
  }

  openCreditnote(element: any): void {
    this.dialogRef2 = this.dialog.open(CreditNoteSettlement, {
      data: {
        invoiceDetails: element,
      },
    });

    this.dialogRef2.afterClosed().subscribe(() => {
      this.filterInvoices();
    });
  }

  editInvoice(invoice: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        invoiceid: JSON.stringify(invoice._id),
      },
    };
    this.router.navigate(["admin/invoices/invoicesdetails"], navigationExtras);
  }
  
  // audit trail dailog
  autidtrail(element: any) {
    this.dialog.open(AuditTrailComponent, {
      data: element,
    });
  }

  // cnhistory dailog
  cnhistory(element: any) {
    this.dialog.open(CnHistoryDailogComponent, {
      data: element,
    });
  }

  openCommentsDialog(comment: any) {
    let invoice_id = comment._id;
    this.dialogRef1 = this.dialog.open(CommentHistoryDailogComponent, {
      data: {
        invoice_id: invoice_id,
      },
    });
  }

  getCompanyName(entity: any): string {
    return entity && entity.buyer && entity.buyer.company_name
      ? entity.buyer.company_name
      : "";
  }

  getSellerCompanyName(entity: any): string {
    return entity && entity.seller && entity.seller.company_name
      ? entity.seller.company_name
      : "";
  }

  getGSTnumber(entity: any) {
    return entity && entity.buyer && entity.buyer.gstin
      ? entity.buyer.gstin
      : "";
  }
  getSellerGSTnumber(entity: any) {
    return entity && entity.seller && entity.seller.gstin
      ? entity.seller.gstin
      : "";
  }

  getInvoiceNo(entity: any) {
    return entity && entity.invoice_number ? entity.invoice_number : "";
  }

  getInvoiceAmount(entity: any) {
    return entity && entity.invoice_amount ? entity.invoice_amount : "";
  }
  // ============================ filter invoices ================>

  filterInvoices() {
    this.apiService.filterInvoices(this.filterdata).subscribe((response: any) => {
      if (response.status == true) {
        this.invoiceList=response.invoice;
        const invoices = response.invoice;
        this.dataSource = new MatTableDataSource(invoices);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "createdAt", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      } else {
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }

  applyFilterInvoiceNo(invoiceno: any) {
    const filterValue = (invoiceno.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
    this.filterdata.invoiceNumber = filterValue.toLocaleUpperCase();
    this.filterInvoices();
  }

  applyFilterPanNo(pan_no: any) {
    const filterValue = (pan_no.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
    this.filterdata.panNumber = filterValue.toLocaleUpperCase();
    if (
      this.filterdata.panuser !== undefined &&
      this.filterdata.panuser !== "" &&
      this.filterdata.panNumber !== undefined &&
      this.filterdata.panNumber !== ""
    ) {
      this.filterInvoices();
    }
  }

  invoicedate() {
    this.filterdata.filterInvoiceByDate = formatDate(
      this.invoiceDate,
      "yyyy-MM-dd",
      "en-US"
    );
    this.filterInvoices();
  }

  panUserType(panuser: any) {
    this.filterdata.panuser = panuser;
    if (
      this.filterdata.panuser !== undefined &&
      this.filterdata.panuser !== "" &&
      this.filterdata.panNumber !== undefined &&
      this.filterdata.panNumber !== ""
    ) {
      this.filterInvoices();
    }
  }

  GstUserType(gstuser: any) {
    this.filterdata.gstuser = gstuser;
    if (
      this.filterdata.gstuser !== undefined &&
      this.filterdata.gstuser !== "" &&
      this.filterdata.gstin !== undefined &&
      this.filterdata.gstin !== ""
    ) {
      this.filterInvoices();
    }
  }

  getGstNo(event: any) {
    let filterValue : any 
    if (event.gst) {
      this.filterdata.gstin 
    }
    else
    {
       filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
      this.filterdata.gstin = filterValue.toLocaleUpperCase();
    }
    
    
    if (
      this.filterdata.gstuser !== undefined &&
      this.filterdata.gstuser !== "" &&
      this.filterdata.gstin !== undefined &&
      this.filterdata.gstin !== ""
    ) {
      this.filterInvoices();
    }
  }

  invoicestatusfilter(invoice_status: any) {
    switch (invoice_status.index) {
      case 1:
        this.filterdata.status = "Pending";
        break;

      case 2:
        this.filterdata.status = "Confirmed";
        break;

      case 3:
        this.filterdata.status = "Partpay";
        break;

      case 4:
        this.filterdata.status = "Paid";
        break;

      default:
        this.filterdata.status = "";
        break;
    }
    this.filterInvoices();
  }
  // ========= dropdwon and auto suggetion =======
  companySuggetion(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length > 2) {
      let companyName = filterValue.toUpperCase();
      if (this.userType == "nbfc") {
        this.apiService.nbfcnameAutoSuggestion(companyName).subscribe((res) => {
          this.company_Name = [...res.get_nbfc];
        });
      } else {
        this.apiService
          .companynameAutoSuggestion(companyName)
          .subscribe((res) => {
            this.company_Name = [...res.companies];
          });
      }
    }
  }

  displayFn(company: any): string {
    return company?.company_name;
  }

  displayFn1(nbfc: any): string {
    return nbfc?.nbfc_name;
  }

  selectUser(usertype: any) {
    this.filterdata.usertype = usertype;
    if (
      this.filterdata.usertype !== undefined &&
      this.filterdata.usertype !== "" &&
      this.filterdata.companyId !== undefined &&
      this.filterdata.companyId !== ""
    ) {
      this.filterInvoices();
    }
  }

  selectInvoiceType(invoice_type: string) {
    if (invoice_type != undefined && invoice_type != null) {
      this.filterdata.invoice_type = invoice_type;
      this.filterInvoices();
    }
  }

  getPosts(companyid: any) {
    this.filterdata.companyId = companyid._id;
    if (
      this.filterdata.companyId !== undefined &&
      this.filterdata.companyId !== "" &&
      this.filterdata.usertype !== undefined &&
      this.filterdata.usertype !== ""
    ) {
      this.filterInvoices();
    }
  }

  getPosts1(nbfc: any) {
    this.filterdata.companyId = nbfc._id;
    if (
      this.filterdata.companyId !== undefined &&
      this.filterdata.companyId !== "" &&
      this.filterdata.usertype !== undefined &&
      this.filterdata.usertype !== ""
    ) {
      this.filterInvoices();
    }
  }
  // ========== invoice due in ============

  invoicesByDueDate(invoiceDueIN: number) {
    this.filterdata.days = invoiceDueIN;
    this.filterInvoices();
  }

  // ========= clear search boxes ==========
  invoiceNumberControl = new FormControl();
  gstControl = new FormControl();
  panNumberControl = new FormControl();

  invoice_clear(ctrl: FormControl) {
    ctrl.setValue("");
    this.filterdata.invoiceNumber = "";
    this.filterInvoices();
  }

  pan_clear(ctrl: FormControl) {
    ctrl.setValue("");
    this.panuserselect = "";
    this.filterdata.panNumber = "";
    this.filterInvoices();
  }

  gst_clear(ctrl: FormControl) {
    ctrl.setValue("");
    this.filterdata.gstuserselect = "";
    this.filterdata.gstin = "";
    this.filterInvoices();
  }

  company_name_clear(ctrl: FormControl) {
    this.company_Name = [];
    ctrl.setValue("");
    this.selection = "";
    this.filterdata.usertype = "";
    this.filterdata.selectedCompanyId = "";
    this.filterInvoices();
  }

  date_cancle(date: any) {
    if (date == "invoice_date") {
      this.invoiceDate = "";
      this.filterdata.filterInvoiceByDate = "";
      this.filterInvoices();
    }
  }

  triggerDeleteDuplicate(option:any){
    // this.apiService.deleteDuplicate(this.userid,option).subscribe
    if(option == 'creditnotes' || option == 'invoices'){
      this.deleteButtonFlag=true;
    }else{
      this.deleteButtonFlag=false;
    }
  }
  deleteDuplicate(option:any){
    this.apiService.deleteDuplicate(this.userid,option).subscribe((res:any)=>{
      this.snackBar.open(res.message,"close",{
        duration:6000
      })
      this.deleteButtonFlag= false;
      window.location.reload();
    })
    
    
  }

}

@Component({
  selector: 'credit-note-settlement',
  templateUrl: 'credit-note-settlement.html',
  styleUrls: ['./credit.scss'],
})
export class CreditNoteSettlement implements OnInit {
  displayedColumns: string[] = [
    "invoice_number",
    "outstanding_amount",
    "gst_settled",
    "Amount_cleared",
    "Remaing_oustanding",
  ];

  CN_form!: FormGroup;

  date_format = DATE_FORMAT;

  currency_format = CURRENCY_FORMAT;

  durationInSeconds = 2;

  invoices: any = [];

  dataSource = new MatTableDataSource([]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialogRef2: MatDialogRef<CreditNoteSettlement>,
    public dialogRef3: MatDialogRef<AddInvoice>
  ) {}

  ngOnInit(): void {
    this.CN_form = this.fb.group({
      Comment: "",
    });
    this.getSettledInvoicesByCreditNoteID();
  }

  getSettledInvoicesByCreditNoteID() {
    const body = {
      buyerid: this.data.invoiceDetails.buyer._id,
      sellerid: this.data.invoiceDetails.seller._id,
      creditnoteid: this.data.invoiceDetails._id,
    };
    this.apiService
      .getSettledInvoicesByCreditNoteID(body)
      .subscribe((resps: any) => {
        if (resps && resps.status && resps.status == true) {
          this.invoices = resps.invoices;
          this.dataSource = new MatTableDataSource(this.invoices);
        } else {
          this.invoices = [];
          this.snackBar.open(resps.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }
      });
  }

  onSubmit() {
    const body = {
      buyerid: this.data.invoiceDetails.buyer._id,
      sellerid: this.data.invoiceDetails.seller._id,
      creditnoteid: this.data.invoiceDetails._id,
    };
    if (
      this.invoices &&
      this.invoices != null &&
      this.invoices != undefined &&
      this.invoices.length > 0
    ) {
      this.apiService
        .settleInvoicesByCreditNoteID(body)
        .subscribe((res: any) => {
          if (res && res.status && res.status == true) {
            this.snackBar.open(res.message, "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
          } else {
            this.snackBar.open(res.message, "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
          }
          this.dialogRef2.close();
        });
    }
    if (this.CN_form.value.comments) {
      const userId = sessionStorage.getItem("LoginId");
      let body = {
        userId: userId,
        id: this.data.invoiceDetails._id,
        comment: this.CN_form.value.comments,
      };
      this.apiService.add_comment(body).subscribe((res: any) => {});
    }
  }

  cancel2() {
    this.dialogRef2.close();
  }

  openAddinvoice(): void {
    this.dialogRef3 = this.dialog.open(AddInvoice, {});
  }
}

@Component({
  selector: 'add-invoice',
  templateUrl: 'add-invoice.html',
  styleUrls: ['./buyerinvoices.component.scss'],
})
export class AddInvoice implements OnInit {

  date_format = DATE_FORMAT;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialogRef2: MatDialogRef<CreditNoteSettlement>,
    public dialogRef3: MatDialogRef<AddInvoice>,
  ) {}

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }

  cancel3() {
    this.dialogRef3.close();
  }
}

@Component({
  selector: 'buyerinvoices-dialog',
  templateUrl: 'buyerinvoices-dialog.html',
  styleUrls: ['./buyerinvoices.component.scss'],
})
export class BuyerinvoicesDialog implements OnInit {

  date_format = DATE_FORMAT;

  delete_form!: FormGroup;

  durationInSeconds = 2;

  userid!: any;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.delete_form = this.fb.group({
      comment: ["", [Validators.required]],
    });
    this.userid = sessionStorage.getItem("LoginId");
  }

  delcomment() {
    if (this.delete_form.valid) {
      const comment = this.delete_form.value.comment;

      this.apiService
        .deleteInvoice(this.data.invoiceDetail._id, this.userid, comment)
        .subscribe((resp: any) => {
          if (resp.status == true) {
            this.snackBar.open("Invoice deleted successfully.", "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
            this.dialog.closeAll();
          } else {
            this.snackBar.open(
              "An error occured, please try again later.",
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
            this.dialog.closeAll();
          }
        });
    }
  }

  cancel() {
    this.dialog.closeAll();
  }
}
