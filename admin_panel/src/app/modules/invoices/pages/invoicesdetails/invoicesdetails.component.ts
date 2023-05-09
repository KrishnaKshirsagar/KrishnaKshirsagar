import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BuyerinvoicesDialog } from "../buyerinvoices/buyerinvoices.component";
import { ApiService } from "../../services/api/api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { formatDate, Location } from "@angular/common";
@Component({
  selector: "app-invoicesdetails",
  templateUrl: "./invoicesdetails.component.html",
  styleUrls: ["./invoicesdetails.component.scss"],
  providers: [],
})
export class InvoicesdetailsComponent implements OnInit {
  
  invoice_form!: FormGroup;

  durationInSeconds = 2;

  editDetailFlag = false;

  maxDate!: Date;

  userid!: any;

  minDate!: Date;

  displayedColumns: string[] = [
    "productname",
    "productid",
    "quantity",
    "price",
    "totalcost",
  ];
  dataSource = new MatTableDataSource([]);

  sellerid!: string;

  select = "";

  credit_plan_id!: string;

  credit_plan_list!: any;

  credit_plan_name: any;

  credit_period: any;

  payment_interval: any;

  planid: any;

  invoice_date!: Date;

  invoice_due_date!: Date;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private _liveAnnouncer: LiveAnnouncer,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<BuyerinvoicesDialog>,
    public dialogRef1: MatDialogRef<CreditplanswitchDialog>,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.invoice_form = this.fb.group({
      invoice_number: ["", [Validators.required,Validators.pattern]],
      invoice_date: "",
      outstanding_amount: ["", [Validators.required,Validators.pattern]],
      extra_credit_flag: "",
      invoice_due_date: ["", [Validators.required,Validators.pattern]],
      invoice_amount: ["", [Validators.required,Validators.pattern]],
      invoice_status: ["", [Validators.required,Validators.pattern]],
      comment : "",
      // =====seller======

      seller_gstin: "",
      seller_mobile: "",
      seller_companyName: "",
      seller_email: "",
      seller_status: "",

      // ===== Buyer
      buyer_gstin: "",
      buyer_mobile: "",
      buyer_companyName: "",
      buyer_email: "",
      buyer_status: "",
      item_data: "",

      //credit plan Id
      // planid:this.planid
    });

    this.route.queryParams.subscribe((params) => {
      this.invoiceDetail = JSON.parse(params["invoiceid"]);
    });

    if (
      this.invoiceDetail &&
      this.invoiceDetail != "" &&
      this.invoiceDetail != undefined
    ) {
      this.invoiceDetailsById();
    }

    this.maxDate = new Date();
    this.userid = sessionStorage.getItem("LoginId");
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  invoiceDetail: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.sellerid && this.sellerid != undefined) {
      this.getCreditplanBycompanyid();
    }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  invoiceDetailsById() {
    this.apiService
      .getinvoiceById(this.invoiceDetail)
      .subscribe((response: any) => {
        if (response && response.status == true) {
          if (response.invoice[0].seller && response.invoice[0].seller._id) {
            this.sellerid = response.invoice[0].seller._id;
            this.credit_plan_name =
              response &&
              response.invoice[0] &&
              response.invoice[0].credit_plan &&
              response.invoice[0].credit_plan.plan_name
                ? response.invoice[0].credit_plan.plan_name
                : "";
            this.credit_period =
              response &&
              response.invoice[0] &&
              response.invoice[0].credit_plan &&
              response.invoice[0].credit_plan.credit_period
                ? response.invoice[0].credit_plan.credit_period
                : "";
            this.payment_interval =
              response &&
              response.invoice[0] &&
              response.invoice[0].credit_plan &&
              response.invoice[0].credit_plan.payment_interval
                ? response.invoice[0].credit_plan.payment_interval
                : "";
            this.invoice_form.patchValue({
              //=============== seller
              seller_gstin: response.invoice[0].seller.gstin,
              seller_mobile: response.invoice[0].seller.company_mobile,
              seller_companyName: response.invoice[0].seller.company_name,
              seller_email: response.invoice[0].seller.company_email,
              seller_status: response.invoice[0].seller.status,
            });
          }
          if (response.invoice[0].buyer && response.invoice[0].buyer._id) {
            this.invoice_form.patchValue({
              // ============= buyer ===========>
              buyer_gstin: response.invoice[0].buyer.gstin,
              buyer_mobile: response.invoice[0].buyer.company_mobile,
              buyer_companyName: response.invoice[0].buyer.company_name,
              buyer_email: response.invoice[0].buyer.company_email,
              buyer_status: response.invoice[0].buyer.status,
              item_data: response.invoice[0].itemized_data,
            });
          }
          this.minDate = response.invoice[0].invoice_date;

          this.invoice_form.patchValue({
            invoice_number: response.invoice[0].invoice_number,
            invoice_date: response.invoice[0].invoice_date,
            outstanding_amount: response.invoice[0].outstanding_amount,
            extra_credit_flag: response.invoice[0].extra_credit_flag,
            invoice_due_date: response.invoice[0].invoice_due_date,
            invoice_amount: response.invoice[0].invoice_amount,
            invoice_status: response.invoice[0].invoice_status,
          });
        }
      });
  }

  onchange() {
    this.editDetailFlag = true;
  }

  onDateChange(){
    this.onchange();
    this.invoice_date =  new Date(this.invoice_form.value.invoice_date); //inv date
    const date = this.invoice_date

    this.invoice_due_date = new Date(this.invoice_form.value.invoice_due_date);

    this.invoice_due_date = new Date(date.setDate(date.getDate() + this.credit_period));

    this.invoice_form.patchValue({
      invoice_due_date: this.invoice_due_date
    })
  }

  onSubmit() {
    if (this.invoice_form.valid && this.editDetailFlag == true) {
      let form_data: any = {};
      // invoice
      form_data.invoice_number = this.invoice_form.value.invoice_number;

      form_data.invoice_due_date = formatDate(
        this.invoice_form.value.invoice_due_date, "yyyy-MM-dd", "en-US"
      );

      form_data.invoice_date = formatDate(
        this.invoice_form.value.invoice_date, "yyyy-MM-dd", "en-US"
      );
      
      form_data.invoice_amount = this.invoice_form.value.invoice_amount;
      form_data.outstanding_amount = this.invoice_form.value.outstanding_amount;
      form_data.extra_credit_flag = this.invoice_form.value.extra_credit_flag;
      form_data.invoice_status = this.invoice_form.value.invoice_status;
      // seller
      form_data.seller_gstin = this.invoice_form.value.seller_gstin;
      form_data.seller_companyName = this.invoice_form.value.seller_companyName;
      form_data.seller_mobile = this.invoice_form.value.seller_mobile;
      form_data.seller_email = this.invoice_form.value.seller_email;
      form_data.seller_status = this.invoice_form.value.seller_status;

      //buyer
      form_data.buyer_gstin = this.invoice_form.value.seller_gstin;
      form_data.buyer_companyName = this.invoice_form.value.seller_companyName;
      form_data.buyer_mobile = this.invoice_form.value.buyer_mobile;
      form_data.buyer_email = this.invoice_form.value.buyer_email;
      form_data.buyer_status = this.invoice_form.value.buyer_status;
      form_data.comment = this.invoice_form.value.comment

      //
      form_data.planid = this.planid;

      this.apiService
        .editInvoice(this.invoiceDetail, this.userid, form_data)
        .subscribe((res: any) => {
          if (res.status == true) {
            this.snackBar.open("Invoice edited successfully.", "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
            this.router.navigate(["admin/invoices"]);
          } else {
            this.snackBar.open("Please try again after sometime.", "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
          }
          this.router.navigate(["admin/invoices"]);
        });
    } else {
      this.snackBar.open(
        "Please fill-up all the fields or change the value to edit this invoice.",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }
  }

  invoicesdetailsdeleteDialog() {
    this.dialogRef = this.dialog.open(BuyerinvoicesDialog, {
      data: {
        invoiceDetail: this.invoiceDetail,
      },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(["admin/invoices"]);
    });
  }

  opencreditswitchDialog() {
    this.dialogRef1 = this.dialog.open(CreditplanswitchDialog, {
      data: {
        sellerid: this.sellerid,
      },
    });
    this.dialogRef1.afterClosed().subscribe((result) => {
      if (result !== undefined && result !== null) {
        this.editDetailFlag = result.flag;
        this.planid = result.credit_plan_details._id;
        this.credit_plan_name = result.credit_plan_details.plan_name;
        this.credit_period = result.credit_plan_details.credit_period;
        this.payment_interval = result.credit_plan_details.payment_interval;
      }
    });
  }

  // company autosuggetion

  getCreditplanBycompanyid() {
    this.apiService
      .getCreditplanByCompanyid(this.sellerid)
      .subscribe((res: any) => {
        if (res && res.plan_Details) {
          this.credit_plan_list = [...res.plan_Details];
        }
      });
  }

  getPosts(credit_plan_details: any) {
    this.editDetailFlag = true;
    this.credit_plan_id = credit_plan_details._id;
  }

  cancelClicked() {
    this.location.back();
  }
}

@Component({
  selector: "invoicesdetailsdelete-dialog",
  templateUrl: "invoicesdetailsdelete-dialog.html",
  styleUrls: ["./invoicesdetails.component.scss"],
})
export class InvoicesdetailsdeleteDialog implements OnInit {
  constructor() {}

  ngOnInit() {}
}

@Component({
  selector: "creditplanswitch-dialog",
  templateUrl: "creditplanswitch-dialog.html",
  styleUrls: ["./invoicesdetails.component.scss"],
})
export class CreditplanswitchDialog implements OnInit {
  switch_plan_form!: FormGroup;
  credit_plan_list!: any[];
  editDetailFlag = false;
  selection = "";
  credit_plan_details: any;
  durationInSeconds = 2;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private apiService: ApiService,
    public dialog: MatDialogRef<CreditplanswitchDialog>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getCreditplanBycompanyid();
  }

  getCreditplanBycompanyid() {
    this.apiService
      .getCreditplanByCompanyid(this.data.sellerid)
      .subscribe((res: any) => {
        if (res && res.plan_Details) {
          this.credit_plan_list = [...res.plan_Details];
        }
      });
  }

  getPosts(credit_plan_details: any) {
    if (this.selection == "") {
      this.editDetailFlag = false;
    } else {
      this.editDetailFlag = true;
      this.credit_plan_details = credit_plan_details;
    }
  }

  onSubmit() {
    if ((this.editDetailFlag = true)) {
      let plan_Details = {
        flag: this.editDetailFlag,
        credit_plan_details: this.credit_plan_details,
      };
      this.dialog.close(plan_Details);
      this.snackBar.open("Credit plan changed successfully.", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
  }

  //
  cancel() {
    this.dialog.close();
  }
}
