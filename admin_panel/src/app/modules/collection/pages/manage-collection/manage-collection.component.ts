import { AfterViewInit, Component, Inject, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { User } from "src/app/shared/interfaces/entities/user.interface";
import { ApiService } from "../../services/api/api.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
  LOCAL_STORAGE_AUTH_DETAILS_KEY,
} from "src/app/shared/constants/constants";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { formatDate } from "@angular/common";
import { CommentsHistoryDialog } from "../over-due-invoices/over-due-invoices.component";
import { CollectionErrorComponent } from "../components/collection-error/collection-error.component";

@Component({
  selector: "app-manage-collection",
  templateUrl: "./manage-collection.component.html",
  styleUrls: ["./manage-collection.component.scss"],
  providers: [],
})
export class ManageCollectionComponent implements AfterViewInit {

  Date_Format = DATE_FORMAT;

  currency_format = CURRENCY_FORMAT;

  comment_category = "option1"

  editflag!: boolean

  advisor_name!: string

  login_user_id!: string;

  selection = "";

  colletion_id!: string;

  collection_status = "";

  overdue_invoice_details!: any;

  comment_form!: FormGroup;

  userSelect: FormControl = new FormControl();

  displayedColumns: string[] = [
    "transactionID",
    "invoice_number",
    "seller_name",
    "amount",
    "pstatus",
    "createdAt",
  ];

  // comment history 
  dataSource1 = new MatTableDataSource([]);

  displayedColumns1: string[] = [
    "comment",
    "commented_by",
    "createdAt",
  ];

  dataSource = new MatTableDataSource([]);

  dataSourceInv = new MatTableDataSource([]);

  displayedColumns2: string[] = [
    "invoice_number",
    "seller_name",
    "seller_gst",
    "invoice_date",
    "gst_amount",
    "invoice_amount",
    "due_date",
    "outstanding_amount",
    "interest_applied",
    "payable_amount",
    "action"
  ];

  @ViewChild('paginator') paginator!: MatPaginator;

  @ViewChild('paginator2') paginator2!: MatPaginator;

  @ViewChild('paginator1') paginator1!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  invoiceid: any;
  collection_advisor_id: any;
  durationInSeconds = 2;
  comment_List!: any[];
  invoiceDetails: any;
  collection_advisor_data!: any[];
  login_user_role!: string | null;
  waiver_flag: boolean = false
  buyer_id: any;
  invoice_number: any;
  claFlag: any = false;
  clStatusFlag: any = false;
  retailer_id: any;
  retailerdata: any = {};

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<InvoiceWaiverDialog>,
    private dialogRef1: MatDialogRef<CommentsHistoryDialog>,
    private dialogRef2: MatDialogRef<CollectionErrorComponent>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.login_user_role = sessionStorage.getItem("Role");
    if (this.login_user_role !== ("xuritiCollectionMgr" || "xuritiCollectionStaff")) {
      this.editflag = true;
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.retailer_id = JSON.parse(params["id"]);
    });
    if (
      this.colletion_id &&
      this.colletion_id != null &&
      this.colletion_id != undefined
    ) {
      // this.getOverdueInvoiceDetails();
    }

    this.comment_form = this.fb.group({
      comment: [""],
      comment_category : [""]
    });

    if (this.retailer_id) {
      this.collectionInv();
    }
    if (this.login_user_role == ("xuritiCollectionMgr" || "xuritiCollectionStaff")){
      this.getCollectonUserAdvisor();
    }
   
  }

  collectionInv() {
    if (this.login_user_role == "xuritiCollectionAgent") {
      this.waiver_flag = true
    }
    this.apiService.collectionInv(this.retailer_id).subscribe((res: any) => {
      if (res.status == true) {
        this.buyer_id = res && res.retailer_data && res.retailer_data.retailer_id ? res.retailer_data.retailer_id : "";
        this.collection_status = res && res.retailer_data && res.retailer_data.collection_status ? res.retailer_data.collection_status : "";
        this.collection_advisor_id = res.retailer_data.collection_advisor_id;
        if (this.editflag) {
          this.advisor_name = res && res.retailer_data && res.retailer_data.collection_advisor_name ? res.retailer_data.collection_advisor_name : "Agent Not Selected";
        }
        else {
          this.advisor_name = res && res.retailer_data && res.retailer_data.collection_advisor_name ? res.retailer_data.collection_advisor_name : 'Select Collection Agent';
          if (this.advisor_name == "Select Collection Agent") {
            this.waiver_flag = false
          }
          else {
            this.waiver_flag = true
          }
        }

        if (this.collection_status == 'Collected') {
            this.waiver_flag = false;
        }

        this.getPaymentHistory()
        this.retailerdata = res && res.retailer_data ? res.retailer_data : "";
        this.dataSourceInv = new MatTableDataSource(res.overdue_invoices);
        this.dataSourceInv.paginator = this.paginator2;
       }

       this.comment_form.patchValue({
        comment_category: res && res.overdue_invoices && res.overdue_invoices.comments && res.overdue_invoices.comments.comment_category ? res.overdue_invoices.comments.comment_category : ""
      });
      
      })
  }

  openCommentsDialog(comment: any) {
    const dialogRef = this.dialog.open(CommentsHistoryDialog, {
      data: {
        comment_history: comment.comments
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  autidtrail(autidtrail : any){
    const dialogRef = this.dialog.open(CollectionErrorComponent, {
      data: {
        comment_history: autidtrail.audit_trail
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource1.paginator = this.paginator1;
    this.dataSource1.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction} ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  openWaiverDialog() {
    const dialogRef = this.dialog.open(InvoiceWaiverDialog, {
      data: {
        retailerdata : this.retailerdata,
        userID: sessionStorage.getItem("LoginId")
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  getPaymentHistory() {
    let body = {
      invoice_id: this.invoiceid,
      buyer_id: this.buyer_id,
      invoice_number: this.invoice_number
    }
    this.apiService.getPaymentHistory(body).subscribe((res: any) => {
      if (res.status == true) {
        // this.dataSource = res.payment_history;
        this.dataSource = new MatTableDataSource(res.trunc_details );
        this.dataSource.paginator = this.paginator;

        //  Data sorting
        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "createdAt", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
      else {
        this.dataSource = new MatTableDataSource([]);
      }
    })
  }

  // compny_mapping dailog

  company_Mapping(staffid: string) {
    const id = staffid != undefined && staffid != null ? staffid : "";
    let navigationExtras: NavigationExtras = {
      queryParams: {
        staffId: JSON.stringify(staffid),
      },
    };
    this.router.navigate(["over-due-invoices/mapping"], navigationExtras);
  }

  updateOverDueInvoice() {
    let update_data : any = {}
    if (!this.collection_advisor_id) {
      this.snackBar.open(
        "Please select collection agent",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
    }

    else if (this.claFlag == true || this.clStatusFlag == true && (this.comment_form.value.comment != "" || this.comment_form.value.comment_category !="")) {
        
      if (this.comment_form.value.comment != "" && this.comment_form.value.comment_category == "") {
        this.snackBar.open(
          "Please select comment category",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      }
      else if (this.comment_form.value.comment_category != "" && this.comment_form.value.comment == "") {
        this.snackBar.open(
          "Please add comment",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      }
      else{
        update_data.comment = this.comment_form.value.comment;
        update_data.comment_category = this.comment_form.value.comment_category;
        update_data.collection_status = this.collection_status;
        update_data.collection_advisor_id = this.collection_advisor_id;
      }
    }

    else if(this.claFlag == true || this.clStatusFlag == true) { 

      if (this.claFlag == true && this.clStatusFlag == true) {
        update_data.collection_advisor_id = this.collection_advisor_id;
        update_data.collection_status = this.collection_status;
      }
      
      else {
        update_data.collection_advisor_id = "";
        update_data.collection_status = "";
      }

      if (this.clStatusFlag == true)
        update_data.collection_status = this.collection_status;
      else
        update_data.collection_status = "";

      if (this.claFlag == true)
        update_data.collection_advisor_id = this.collection_advisor_id;
      else
        update_data.collection_advisor_id = "";   
    }

    else
      if (this.comment_form.value.comment != "" && this.comment_form.value.comment_category !="") {
        update_data.comment = this.comment_form.value.comment;
        update_data.comment_category = this.comment_form.value.comment_category;
        update_data.collection_status = this.collection_status;
        update_data.collection_advisor_id = this.collection_advisor_id;
      }
      else if (this.comment_form.value.comment != "" && this.comment_form.value.comment_category == "") {
        this.snackBar.open(
          "Please select comment category",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      }
      else if (this.comment_form.value.comment_category != "" && this.comment_form.value.comment == "") {
        this.snackBar.open(
          "Please add comment",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      }
      else{
        this.snackBar.open(
          "Please select collection agent or status",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      }

      if (JSON.stringify(update_data) !== '{}') {
        update_data.assigned_by = sessionStorage.getItem('LoginId')
        this.apiService.updateOverDueInvoice(update_data, this.buyer_id).subscribe((res: any) => {
          if (res.status == true) {
            this.waiver_flag = true;
            this.snackBar.open(
              res.message,
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
            this.clStatusFlag = false;
            this.claFlag = false;
            this.comment_form.patchValue({
              comment: ""
            })
            // this.getOverdueInvoiceDetails();
            this.collectionInv();
          }
          else {
            this.snackBar.open(
              res.message,
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
            this.clStatusFlag = false;
            this.claFlag = false;
          }
        })
      }
  }

  getCollectonUserAdvisor() {
    this.apiService
      .getCollectionStaff()
      .subscribe((res) => {
        this.collection_advisor_data = [...res.userlist];
      });
  }

  getClStaff(val: any) {
    if (val) {
      this.claFlag = true;
      this.collection_advisor_id = val._id;
    }
    else {
      this.claFlag = false;
    }
  }

  collectionStatus(status: any) {
    if (status) {
      this.clStatusFlag = true;
      this.collection_status = status;
    }
    else {
      this.clStatusFlag = false;
    }
  }
}

@Component({
  selector: "invoice-waiver-dialog",
  templateUrl: "invoice-waiver-dialog.html",
  styleUrls: ["./manage-collection.component.scss"],
})
export class InvoiceWaiverDialog implements AfterViewInit {

  myControl = new FormControl('');

  sellerlist: any= [];

  currency_format = CURRENCY_FORMAT;

  editflag!: boolean;

  payableAmount: any;

  fullAmountPayflag = true;

  waiver_Amount!: any;

  partPay!: any;

  partpayerrorflag = false;

  error_flag = false;

  input_check_flag = false

  intrest_check_error_flag = false;

  displayedColumns: string[] = [
    "seller",
    "order_amount",
    "cleared_amount",
    "interest",
    "waiver",
    "status",
    "date",
  ];

  dataSource = new MatTableDataSource([]);
  durationInSeconds = 2;
  login_user_role: string | null;
  sellerid: any;
  collection_summary_data: any = {};
  buyer_id: any;
  part_pay: any = {};

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogueRef: MatDialogRef<InvoiceWaiverDialog>,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.login_user_role = sessionStorage.getItem("Role");
    if ( this.login_user_role !== ("xuritiCollectionMgr" || "xuritiCollectionStaff" || "xuritiCollectionAgent")) {
      this.editflag = false;
    }
  }

  ngOnInit() {
    this.buyer_id = this.data.retailerdata.retailer_id
    this.getSellerlistByCompanyid();
    this.getWaiverPaymentHistory();
    // this.payableAmount = this.data.invoiceDetails.total_outstanding_amount;
    // this.data.invoiceDetails.interest = +(this.data.invoiceDetails.interest).toFixed(2);
  }

  getSellerlistByCompanyid(){
    this.apiService.getSellerlistByBuyerid(this.buyer_id).subscribe((resp: any) => {
      if(resp && resp.status == true){
        const length = resp && resp.seller && resp.seller.length ? resp.seller.length : 0;
        for(let i=0; i<length; i++){
          if(resp.seller[i]){
            this.sellerlist.push(resp.seller[i]);
          }
        }
      }else{
        this.snackBar.open(
          resp.message,
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
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

  displayFn(company: any){
    const company_name = company && company.company_name ? company.company_name : ''
    return company_name;
  }

  onChange(comp: any){    
    const sellerid = comp._id;
    if(sellerid && sellerid != undefined){
      this.sellerid = sellerid;
      this.collection_summry();
      
    }
  }
  collection_summry() {
    let data : any = {}
    data.buyer_id = this.buyer_id,
    data.seller_id = this.sellerid,
    data.waiver = this.waiver_Amount,
    this.apiService.collection_summry(data).subscribe((res:any) =>{
      if (res.status == true) {
        this.collection_summary_data = res ;
      }
      else{
        this.collection_summary_data = {}
      }
    })
  }

  clear(ctrl:FormControl){
    ctrl.setValue(null);
    this.sellerid = "";
    this.collection_summary_data = {}
  }

  waiver_amount() {
    this.waiver_Amount = (+this.waiver_Amount).toFixed(2);
    this.collection_summary_data.total_interest = parseFloat(this.collection_summary_data.total_interest);
    this.waiver_Amount = parseFloat(this.waiver_Amount);
    if (this.fullAmountPayflag == true) {
      if (this.waiver_Amount > this.collection_summary_data.total_interest) {
        this.intrest_check_error_flag = true;
        this.error_flag = true;
      }
      else {
        this.intrest_check_error_flag = false;
        this.error_flag = false;
      }
    }
    else if (this.fullAmountPayflag == false) {
      if (this.waiver_Amount > this.part_pay.interest) {
        this.intrest_check_error_flag = true;
        this.error_flag = true;
      }
      else {
        this.intrest_check_error_flag = false;
        this.error_flag = false;
      }
    }
  }

  checkInputValue(value: any) {
    let filterValue = (value.target as HTMLInputElement).value;
    if (!filterValue.match(/^[0-9.]*$/)) {
      this.input_check_flag = true
    }

    else {
      this.input_check_flag = false
    }
  }

  getWaiverPaymentHistory() {
    
    this.apiService.getwaiverPaymentHistory(this.buyer_id).subscribe((res: any) => {
      if (res.status == true) {
        this.dataSource = new MatTableDataSource(res.payment_history);
        this.dataSource.paginator = this.paginator;
      }
      else {
        this.dataSource = new MatTableDataSource([]);
      }
    })
  }

  sharePaymentlink() {
    let body: any = {}
    if ((this.fullAmountPayflag == true) && (this.intrest_check_error_flag == false)) {    
      if (!this.sellerid) {
        this.snackBar.open(
          "Please select anchor",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      }
      else
      {
        if (!this.waiver_Amount) {
          body.buyerId = this.buyer_id;
          body.full_payment = true;
          body.interest = this.collection_summary_data.total_interest;
          body.orderAmount = this.collection_summary_data.total_payable;
          body.seller_id = this.sellerid;
          body.waver = "0";
          body.total_outstanding = this.collection_summary_data.total_outstanding;
          body.total_gst = this.collection_summary_data.total_gst;
          body.total_payable = this.collection_summary_data.total_payable;
          body.settled_amount = this.collection_summary_data.settled_amount;
          body.invoiceDetails = this.collection_summary_data.invoiceDetails;
        }
        else {
          body.buyerId = this.buyer_id;
          body.full_payment = true;
          body.interest = this.collection_summary_data.total_interest;
          body.orderAmount = this.collection_summary_data.total_payable;
          body.seller_id = this.sellerid;
          body.waver = this.waiver_Amount;
          body.total_outstanding = this.collection_summary_data.total_outstanding;
          body.total_gst = this.collection_summary_data.total_gst;
          body.total_payable = this.collection_summary_data.total_payable;
          body.settled_amount = this.collection_summary_data.settled_amount;
          body.invoiceDetails = this.collection_summary_data.invoiceDetails;
        }
        this.apiService.waiverPayment(body).subscribe((res: any) => {
          if (res.status == true) {
            this.snackBar.open(
              res.message,
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
            this.dialogueRef.close();
          }
          else {
            this.snackBar.open(
              res.message,
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          }
        })
      }
    }

    else if ((this.fullAmountPayflag == false) && (this.intrest_check_error_flag == false) && (this.partpayerrorflag == false)) {
      
      if (!this.sellerid) {
        this.snackBar.open(
          "Please select anchor",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      }

      else
      {
        if (this.partPay == undefined || this.partPay == 0) {
          this.snackBar.open(
            "Please enter valid part pay amount",
            "Close",
            {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            }
          );
        }
        else {
          if (!this.waiver_Amount) {
          body.buyerId = this.buyer_id;
          body.full_payment = false;
          body.interest = this.part_pay.interest;
          body.orderAmount = this.part_pay.orderAmount;
          body.seller_id = this.sellerid;
          body.waver = "0";
          body.total_outstanding =  this.part_pay.outstanding_amount;
          body.total_gst = this.part_pay.total_gst;
          body.total_payable = this.part_pay.orderAmount;
          body.settled_amount = this.part_pay.settled_amount ;
          body.invoiceDetails = this.part_pay.invoiceDetails;
  
          }
          else {
          body.buyerId = this.buyer_id;
          body.full_payment = false;
          body.interest = this.part_pay.interest;
          body.orderAmount = this.part_pay.orderAmount;
          body.seller_id = this.sellerid;
          body.waver = this.waiver_Amount;
          body.total_outstanding =  this.part_pay.outstanding_amount;
          body.total_gst = this.part_pay.total_gst;
          body.total_payable = this.part_pay.orderAmount;
          body.settled_amount = this.part_pay.settled_amount ;
          body.invoiceDetails = this.part_pay.invoiceDetails;
          }
  
          this.apiService.waiverPayment(body).subscribe((res: any) => {
            if (res.status == true) {
              this.snackBar.open(
                res.message,
                "Close",
                {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                }
              );
              this.dialogueRef.close()
            }
            else {
              this.snackBar.open(
                res.message,
                "Close",
                {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                }
              );
            }
          })
        }
      }
     
    }
  }

  onEnterPartPay(amount: any) {
    this.partPay = this.partPay;
    this.collection_summary_data.total_outstanding = parseFloat(this.collection_summary_data.total_outstanding);

    this.partPay = (+this.partPay).toFixed(2);
    this.partPay = parseFloat(this.partPay);

    if (this.partPay > this.collection_summary_data.total_payable) {
      this.partpayerrorflag = true;
      this.error_flag = true
    }

    else {   
      this.partpayerrorflag = false;
      this.error_flag = false;
      this.partPay = (amount.target as HTMLInputElement).value;
      this.partPay = (+this.partPay).toFixed(2);
      this.partPay = parseFloat(this.partPay);

    let data : any = {}
    data.buyer_id = this.buyer_id,
    data.seller_id = this.sellerid,
    data.waiver = this.waiver_Amount,
    data.pay_amount = this.partPay
    this.apiService.collection_summry(data).subscribe((res:any) => {
        this.part_pay.interest = res.total_interest;
        this.part_pay.orderAmount = this.partPay;
        this.part_pay.outstanding_amount = res.total_outstanding
        this.part_pay.total_gst = res.total_gst;
        this.part_pay.total_payable = this.partPay;
        this.part_pay.settled_amount = res.settled_amount;
        this.part_pay.invoiceDetails = res.invoiceDetails;
      })
    }
  }

  onSelectCompleteAmount(flag: boolean) {
    this.fullAmountPayflag = flag;
    if (this.fullAmountPayflag == true) {
      this.partPay = 0;
      this.part_pay.interest = 0;
      this.waiver_Amount = "0";
      if (this.partPay == 0) {
        this.partpayerrorflag = false
      }
      if (this.waiver_Amount == "0") {
        this.intrest_check_error_flag = false
      }
    }
  }
}

