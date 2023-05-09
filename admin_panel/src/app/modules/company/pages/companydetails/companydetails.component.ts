import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { ApiService } from "../../services/api/api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Location } from "@angular/common";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
} from "src/app/shared/constants/constants";
import { CompanyFetchDialogComponent } from "../components/company-fetch-dialog/company-fetch-dialog.component";
@Component({
  selector: "app-companydetails",
  templateUrl: "./companydetails.component.html",
  styleUrls: ["./companydetails.component.scss"],
  providers: [],
})
export class CompanydetailsComponent implements OnInit {
  durationInSeconds = 2;

  inputvalue = "";

  companyDetail: any;

  companyid!: string;

  companyName!: string;

  companyDetail_form!: FormGroup;

  gstinflag = false;

  panfalg = false;

  company_nameflag = false;

  cinflag = false;

  tanflag = false;

  creditlimitflag = false;

  valueChangeFlag = false;

  cibilFile: any = []; // File upload

  discussionFile: any = [];

  experianFile: any = [];

  agreementFile: any = [];

  otherFile: any = [];

  cibil_doc: any = []; // File upload

  discussion_doc: any = [];

  experian_doc: any = [];

  agreement_doc: any = [];

  other_doc: any = [];

  seller_flag: boolean = false;

  add_associated_seller_flag: boolean = false;

  associated_seller: any = [];

  nbfc_data: any = [];

  companyList: any = [];

  seller_list:any=[];

  seller_id!: string;

  creditplnlist:any=[];

  active_nbfc_list:any=[];

  nbfc_id!: string;

  planid!:string;

  companyMap_form!: FormGroup;

  userid: any;

  displayedColumns: string[] = [

    "seller_name",
    "credit_plan_name",
    "nbfc",
    "credit_limit"
  ];

  display_table_flag: boolean = false;

  dataSource = new MatTableDataSource();

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CompanydetailsapproveDialog>,
    private location: Location,
    private matDialog: MatDialog
  ) {}

  backpage() {
    this.location.back();
  }

  ngOnInit(): void {
    this.userid = sessionStorage.getItem("LoginId")
    ? sessionStorage.getItem("LoginId")
    : "";
    this.companyDetail_form = this.fb.group({
      company_name: ["", [Validators.required]],
      gstin: ["", [Validators.pattern, Validators.required]],
      district: ["", [Validators.required, Validators.pattern]],
      state: ["", [Validators.pattern, Validators.required]],
      pinCode: ["", [Validators.required]],
      address: ["", [Validators.required]],
      industry_type: ["", [Validators.pattern]],
      cin: "",
      tan: "",
      pan: ["", [Validators.required]],
      annual_turnover: ["", [Validators.required]],
      xuriti_score: ["", [Validators.required]],

      admin_email: ["", [Validators.required]],
      admin_mobile: ["", [Validators.pattern, Validators.required]],
      creditLimit: ["", [Validators.required]],
      interest: ["", [Validators.required]],
      status: "",
      eNachMandate: false,
      seller_flag: false,
      company_email: ["", [Validators.pattern, Validators.required]],
      company_mobileNumber: ["", [Validators.pattern, Validators.required]],
      admin_name: ["", [Validators.required]],
      associated_seller: [""],
      updated_by: sessionStorage.getItem("LoginId"),
      comment: ["", Validators.pattern],
      userId: sessionStorage.getItem("LoginId"),
      documentList: [""],
    });
    this.companyMap_form = this.fb.group({
      buyers: new FormControl(),
      associated_sellers:["",[Validators.required]],
      associated_sellers_plan:["",[Validators.required]],
      associated_nbfc:["",[Validators.required]],
      creditLimit:["",[Validators.required]]
    });
  
    this.route.queryParams.subscribe((params) => {
      this.companyDetail = JSON.parse(params["companyid"]);
    });

    this.companyid = this.companyDetail;
    if (this.companyid && this.companyid != "" && this.companyid != undefined) {
      this.companyDetailsByCid();
    }
   this.apiService.getSellerList().subscribe((respon: any) => {
      if (respon?.status == true) {
        this.seller_list  = respon?.seller_list;
      }
    });
    this.apiService.getNBFClist().subscribe((response:any)=>{
       response.get_nbfc.forEach((element: any) => {
        if(element.nbfc_status=="Active")
        this.active_nbfc_list.push(element)
        });
    })
    this.get_mapped_nbfc_data();
   
  }

  openEsignPage() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: JSON.stringify(this.companyid),
      },
    };
    this.router.navigate(
      [`admin/companies/${this.companyid}/e-sign`],
      navigationExtras
    );
  }

  updateGST(data?: any) {
    data = {
      gstin: this.companyDetail_form.value.gstin,
    };
    this.apiService.updateGST(data).subscribe((response: any) => {
      if (!response.status) {
        this.snackBar.open(response.message, "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
        return;
      } else {
        this.snackBar.open(response.message, "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
        window.location.reload();
      }
    });
  }

  openFetchDialog() {
    this.dialog.open(CompanyFetchDialogComponent, {
      height: "500px",
      width: "1000px",
    });
  }

  sellerFlagCheack(eve: any) {
    this.onchange();
    this.seller_flag = eve?.checked;
  }

  getSellerList() {
    this.add_associated_seller_flag = true;
    this.apiService.getSellerList().subscribe((respon: any) => {
      if (respon?.status == true) {
        this.companyList = respon?.seller_list;
      }
    });
  }

  cancel() {
    this.location.back();
  }

  companyDetailsByCid() {
    this.apiService.getCompany(this.companyid).subscribe((response: any) => {
      if (response && response.status == true) {
        (this.seller_flag =
          response.company && response.company.seller_flag
            ? response.company.seller_flag
            : false),
          (this.companyName =
            response.company && response.company.company_name
              ? response.company.company_name
              : "");
        this.cibil_doc =
          response.company && response.company.cibil_doc
            ? response.company.cibil_doc
            : [];
        this.discussion_doc =
          response.company && response.company.personal_doc
            ? response.company.personal_doc
            : [];
        this.experian_doc =
          response.company && response.company.experian_doc
            ? response.company.experian_doc
            : [];
        this.agreement_doc =
          response.company && response.company.agreement_doc
            ? response.company.agreement_doc
            : [];
        this.other_doc =
          response.company && response.company.other_doc
            ? response.company.other_doc
            : [];
        this.associated_seller =
          response &&
          response.company &&
          response.company.associated_seller &&
          response.company.associated_seller.length > 0
            ? response.company.associated_seller[0]
            : [];

        let admin_first =
          response &&
          response.company &&
          response.company.createdBy &&
          response.company.createdBy.first_name
            ? response.company.createdBy.first_name
            : "";
        let admin_last =
          response &&
          response.company &&
          response.company.createdBy &&
          response.company.createdBy.last_name
            ? response.company.createdBy.last_name
            : "";

        this.nbfc_data = response.company.nbfc;
        this.companyDetail_form.patchValue({
          company_name:
            response.company && response.company.company_name
              ? response.company.company_name
              : "",
          gstin:
            response.company && response.company.gstin
              ? response.company.gstin
              : "",
          district:
            response.company && response.company.district
              ? response.company.district
              : "",
          state:
            response.company && response.company.state
              ? response.company.state
              : "",
          pinCode:
            response.company && response.company.pincode
              ? response.company.pincode
              : "",
          industry_type:
            response.company && response.company.industry_type
              ? response.company.industry_type
              : "",
          cin:
            response.company && response.company.cin
              ? response.company.cin
              : "",
          tan:
            response.company && response.company.tan
              ? response.company.tan
              : "",
          pan:
            response.company && response.company.pan
              ? response.company.pan
              : "",
          annual_turnover:
            response.company && response.company.annual_turnover
              ? response.company.annual_turnover
              : "",
          xuriti_score:
            response.company && response.company.xuriti_score
              ? response.company.xuriti_score
              : 0,
          admin_name: admin_first + " " + admin_last,
          status:
            response.company && response.company.status
              ? response.company.status
              : "",
          admin_email:
            response.company &&
            response.company.createdBy &&
            response.company.createdBy.email
              ? response.company.createdBy.email
              : "",
          admin_mobile:
            response.company &&
            response.company.createdBy &&
            response.company.createdBy.mobile_number
              ? response.company.createdBy.mobile_number
              : "",
          creditLimit:
            response.company && response.company.creditLimit
              ? response.company.creditLimit
              : 0,
          address:
            response.company && response.company.address
              ? response.company.address
              : "",
          company_email:
            response.company && response.company.company_email
              ? response.company.company_email
              : "",
          company_mobileNumber:
            response.company && response.company.company_mobile
              ? response.company.company_mobile
              : "",
          eNachMandate:
            response.company && response.company.eNachMandate
              ? response.company.eNachMandate
              : false,
          seller_flag: this.seller_flag,
          interest:
            response.company && response.company.interest
              ? response.company.interest
              : 0,
        });
      }
    });
  }

  selectedSeller(event: any) {
    this.onchange();
    this.associated_seller = event?.value;
  }
  onSelected(event:any){
    this.seller_id=event.value;
    this.apiService.fetchCreditPlansByCompanyId(this.seller_id).subscribe((response:any)=>{
      if((response?.plan_Details?.length)>0){
        this.creditplnlist = response.plan_Details?response.plan_Details:[]

      }

    })
  }
  on_plan_Selected(event:any){
    this.planid = event.value;
  }
  on_NBFC_Selected(event:any){
   this.nbfc_id =event.value;
  }
  get_mapped_nbfc_data(){
    if(this.seller_flag!=true){
      this.apiService.get_mapped_nbfc_data(this.companyid).subscribe((response:any)=>{
        if(response?.data.length>0){
          this.display_table_flag=true;
          this.dataSource = new MatTableDataSource(response?.data);
        }
      })
    }
  }
  onMapCompanies() {
  if(this.companyMap_form.valid){
    if (this.companyid && this.companyid != undefined) {
      const body = {
        credit_planid:this.planid,
        seller_id: this.seller_id,
        buyers: [{ buyer_id: this.companyid }],
        companies: [
                {
                  buyer_id: this.companyid,
                  seller_id: this.seller_id,
                  // payout_fee: this.companyMap_form?.value?.payout_fee ?? 0,
                  credit_limit:this.companyMap_form?.value?.creditLimit?? 0
                },
              ]
      };
      this.apiService.addCompanyPlanMap(body).subscribe(async (resp: any) => {
        if (resp.status == true) {
          this.apiService.NBFCCompanyMapping(this.nbfc_id, this.userid,body).subscribe((response: any) => {
          if (response.status == true) {
            this.snackBar.open(
              "Company is mapped with NBFC successfully.",
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          } else {
            this.snackBar.open((response.messges || response.message), "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
          }
        });
        }else{
          this.snackBar.open((resp.messges || resp.message), "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }
      });
    } else {
      this.snackBar.open(
        "Please select company to map with credit plan",
        "Close",
        {
          duration: this.durationInSeconds * 7000,
          panelClass: ["error-dialog"],
        }
      );
    }
  } else {
    this.snackBar.open(
      "Please insert required fields to map",
      "Close",
      {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      }
    );
  }
  }

  onchange() {
    this.valueChangeFlag = true;
  }

  // ======= company updated releted flag change ======

  gstinchange() {
    this.gstinflag = true;
  }
  tanchange() {
    this.tanflag = true;
  }
  companychange() {
    this.company_nameflag = true;
  }
  cinchange() {
    this.cinflag = true;
  }
  panchange() {
    this.panfalg = true;
  }
  creditlimichange() {
    this.creditlimitflag = true;
  }

  changeEvent(event: any) {
    if (event && event.target && event.target.id) {
      this.valueChangeFlag = true;
      switch (event.target.id) {
        case "cibil":
          if (event.target.files[0].size <= "5242880") {
            this.cibilFile = [];
            this.cibilFile.push(event.target.files[0]);
          } else {
            this.snackBar.open(
              "File size cannot be greater than 5MB.",
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          }
          break;

        case "discussion":
          if (event.target.files[0].size <= "10485760") {
            this.discussionFile = [];
            this.discussionFile.push(event.target.files[0]);
          } else {
            this.snackBar.open(
              "File size cannot be greater than 10MB.",
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          }
          break;

        case "experian":
          if (event.target.files[0].size <= "5242880") {
            this.experianFile = [];
            this.experianFile.push(event.target.files[0]);
          } else {
            this.snackBar.open(
              "File size cannot be greater than 5MB.",
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          }
          break;

        case "agreement":
          if (event.target.files[0].size <= "5242880") {
            this.agreementFile = [];
            this.agreementFile.push(event.target.files[0]);
          } else {
            this.snackBar.open(
              "File size cannot be greater than 5MB.",
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          }
          break;

        case "other":
          if (event.target.files[0].size <= "5242880") {
            this.otherFile = [];
            this.otherFile.push(event.target.files[0]);
          } else {
            this.snackBar.open(
              "File size cannot be greater than 5MB.",
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          }
          break;

        default:
          break;
      }
    }
  }

  clearCIBIL_Doc() {
    (<HTMLInputElement>document.getElementById("cibil")).value = "";
    this.cibilFile = [];
  }

  clearPersonal_Doc() {
    (<HTMLInputElement>document.getElementById("discussion")).value = "";
    this.discussionFile = [];
  }

  clearExperian_Doc() {
    (<HTMLInputElement>document.getElementById("experian")).value = "";
    this.experianFile = [];
  }

  clearAgreement_Doc() {
    (<HTMLInputElement>document.getElementById("agreement")).value = "";
    this.agreementFile = [];
  }

  clearOther_Doc() {
    (<HTMLInputElement>document.getElementById("other")).value = "";
    this.otherFile = [];
  }

  updateCompanyDetail() {
    if (this.companyDetail_form.valid && this.valueChangeFlag == true) {
      let formData: FormData = new FormData();

      formData.append(
        "company_name",
        this.companyDetail_form.value.company_name
      );
      formData.append("gstin", this.companyDetail_form.value.gstin);
      formData.append("district", this.companyDetail_form.value.district);
      formData.append("state", this.companyDetail_form.value.state);
      formData.append("pinCode", this.companyDetail_form.value.pinCode);
      formData.append(
        "industry_type",
        this.companyDetail_form.value.industry_type
      );
      formData.append("cin", this.companyDetail_form.value.cin);
      formData.append("tan", this.companyDetail_form.value.tan);
      formData.append("pan", this.companyDetail_form.value.pan);
      if (this.creditlimitflag == true) {
        formData.append(
          "annual_turnover",
          this.companyDetail_form.value.annual_turnover
        );
      }
      formData.append(
        "xuriti_score",
        this.companyDetail_form.value.xuriti_score
      );
      formData.append("address", this.companyDetail_form.value.address);
      formData.append("admin_email", this.companyDetail_form.value.admin_email);
      formData.append(
        "admin_mobile",
        this.companyDetail_form.value.admin_mobile
      );
      formData.append("creditLimit", this.companyDetail_form.value.creditLimit);
      formData.append("interest", this.companyDetail_form.value.interest);
      formData.append("status", this.companyDetail_form.value.status);
      formData.append(
        "eNachMandate",
        this.companyDetail_form.value.eNachMandate
      );
      formData.append("seller_flag", String(this.seller_flag));
      formData.append(
        "company_email",
        this.companyDetail_form.value.company_email
      );
      formData.append(
        "company_mobileNumber",
        this.companyDetail_form.value.company_mobileNumber
      );
      formData.append("admin_name", this.companyDetail_form.value.admin_name);
      formData.append("associated_seller", this.associated_seller);
      formData.append("updated_by", this.companyDetail_form.value.updated_by);
      formData.append("userId", this.companyDetail_form.value.updated_by);
      formData.append("comment", this.companyDetail_form.value.comment);

      if (this.cibilFile && this.cibilFile.length > 0) {
        this.cibilFile.forEach((element: any) => {
          formData.append("cibil_doc", element);
        });
      }
      if (this.discussionFile && this.discussionFile.length > 0) {
        this.discussionFile.forEach((element: any) => {
          formData.append("personal_doc", element);
        });
      }
      if (this.experianFile && this.experianFile.length > 0) {
        this.experianFile.forEach((element: any) => {
          formData.append("experian_doc", element);
        });
      }
      if (this.agreementFile && this.agreementFile.length > 0) {
        this.agreementFile.forEach((element: any) => {
          formData.append("agreement_doc", element);
        });
      }
      if (this.otherFile && this.otherFile.length > 0) {
        this.otherFile.forEach((element: any) => {
          formData.append("other_doc", element);
        });
      }
      if (
        this.gstinflag ||
        this.cinflag ||
        this.tanflag ||
        this.company_nameflag ||
        this.panfalg
      ) {
        this.dialog.open(CompanydetailseditDialog, {
          data: {
            company_update_data: this.companyDetail_form.value,
            formData: formData,
            companyid: this.companyid,
            tanflag: this.tanflag,
            cinflag: this.cinflag,
            panflag: this.panfalg,
            companynameflag: this.company_nameflag,
            gstinflag: this.gstinflag,
          },
        });
        this.dialogRef.close();
      } else {
        this.apiService
          .updateCompanyDetails(this.companyid, formData)
          .subscribe((resp: any) => {
            if (resp.status == true) {
              if (this.creditlimitflag == true) {
                this.snackBar.open(
                  "Credit limit is changed, it will be reflected once the credit manager will approve this request.",
                  "Close",
                  {
                    duration: this.durationInSeconds * 3000,
                    panelClass: ["error-dialog"],
                  }
                );
              } else {
                this.snackBar.open(
                  "Company details updated successfully",
                  "Close",
                  {
                    duration: this.durationInSeconds * 3000,
                    panelClass: ["error-dialog"],
                  }
                );
              }
              this.router.navigate(["admin/companies"]);
            } else {
              this.snackBar.open(resp.message, "Close", {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              });
            }
          });
      }
    } else {
      this.snackBar.open(
        "Please insert required fields or make chages to edit.",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }
  }

  openCompanyApproveDialog(approvalFlag: boolean, companyid: string) {
    this.dialog.open(CompanydetailsapproveDialog, {
      data: {
        companyid: this.companyid,
        approvalFlag: approvalFlag,
      },
    });
  }

  openCompanyEditDialog() {
    this.dialog.open(CompanydetailseditDialog);
  }

  openCompanyDeleteDialog() {
    this.dialog.open(CompanydetailsdeleteDialog);
  }

  companiesByStatus(event: any) {}
}

// ========================================================================

@Component({
  selector: "companydetailsapprove-dialog",
  templateUrl: "companydetailsapprove-dialog.html",
  styleUrls: ["./companydetails.component.scss"],
})
export class CompanydetailsapproveDialog implements OnInit {
  durationInSeconds = 2;

  companyApproval_form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CompanydetailsapproveDialog>,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.companyApproval_form = this.fb.group({
      comment: ["", [Validators.required]],
    });
  }

  onSubmit() {
    if (this.companyApproval_form.valid) {
      const statusBody: any = {
        // companyid: companyid,
        status: this.data.approvalFlag == true ? "Approved" : "Hold",
        msg: this.companyApproval_form.value.comment,
      };
      this.apiService
        .changeCompanyStatus(this.data.companyid, statusBody)
        .subscribe((resp: any) => {
          if (resp) {
            if (resp.status == true) {
              this.snackBar.open(
                "Company Status is changed successfully",
                "Close",
                {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                }
              );
            } else {
              this.snackBar.open(
                "Unable to change the Company Status, Please try again after sometime",
                "Close",
                {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                }
              );
            }
            this.router.navigate(["admin/companies"]);
            this.dialogRef.close(resp);
          }
        });
    }
  }
}

// ==============================================================

@Component({
  selector: "companydetailsedit-dialog",
  templateUrl: "companydetailsedit-dialog.html",
  styleUrls: ["./companydetails.component.scss"],
})
export class CompanydetailseditDialog implements OnInit {
  verify_form!: FormGroup;

  durationInSeconds = 2;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CompanydetailsapproveDialog>,
    private apiService: ApiService,
    private location: Location
  ) {}

  ngOnInit() {
    let formValidators: any = {};
    if (this.data.gstinflag) {
      formValidators.gstin = [false, Validators.requiredTrue];
    }

    if (this.data.panflag) {
      formValidators.pan = [false, Validators.requiredTrue];
    }

    if (this.data.companynameflag) {
      formValidators.company_name = [false, Validators.requiredTrue];
    }

    if (this.data.cinflag) {
      formValidators.cin = [false, Validators.requiredTrue];
    }

    if (this.data.tanflag) {
      formValidators.tan = [false, Validators.requiredTrue];
    }

    this.verify_form = this.fb.group(formValidators);
  }

  verifyCompany() {
    if (this.verify_form.valid == false) {
      this.snackBar.open("Please mark verify all the fields", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    } else {
      this.apiService
        .updateCompanyDetails(this.data.companyid, this.data.formData)
        .subscribe((resp: any) => {
          if (resp.status == true) {
            this.snackBar.open(
              "Company details updated successfully",
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          } else {
            this.snackBar.open(resp.errors.message, "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
          }
          this.router.navigate(["admin/companies"]);
          this.dialogRef.close();
        });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}

// ==================== COMPANY DELETE =========================
@Component({
  selector: "companydetailsdelete-dialog",
  templateUrl: "companydetailsdelete-dialog.html",
  styleUrls: ["./companydetails.component.scss"],
})
export class CompanydetailsdeleteDialog implements OnInit {
  constructor() {}

  ngOnInit() {}
}
