import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { CURRENCY_FORMAT, DATE_FORMAT } from 'src/app/shared/constants/constants';
@Component({
  selector: 'app-companydetails',
  templateUrl: './companydetails.component.html',
  styleUrls: ['./companydetails.component.scss'],
  providers: [],
})
export class CompanydetailsComponent implements OnInit {

  durationInSeconds = 2;

  inputvalue="";

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

  cibil_doc: any = []; // File upload

  discussion_doc: any = [];

  experian_doc: any = [];

  agreement_doc: any = [];

  other_doc: any = [];

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    // public dialogRef: MatDialogRef<CompanydetailsapproveDialog>,
    public dialogRef: MatDialogRef<any>,

    private location: Location
  ) {}

  ngOnInit(): void {
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
      company_email: ["", [Validators.pattern, Validators.required]],
      company_mobileNumber: ["", [Validators.pattern, Validators.required]],
      admin_name: ["", [Validators.required]],
      updated_by: sessionStorage.getItem("LoginId"),
    });

    this.route.queryParams.subscribe((params) => {
      this.companyid = JSON.parse(params["id"]);
    });
    if (this.companyid && this.companyid != "" && this.companyid != undefined) {
      this.companyDetailsByCid();
    }
  }

  cancel() {
    this.location.back();
  }

  companyDetailsByCid() {
    this.apiService.getCompanyDetailsById(this.companyid).subscribe((response: any) => {
      if (response && response.status == true) {
        this.companyDetail = response.company ? response.company : [];
        this.companyName = response.company && response.company.company_name ? response.company.company_name : '';

        this.cibil_doc = response.company && response.company.cibil_doc ? response.company.cibil_doc : [];
        this.discussion_doc = response.company && response.company.personal_doc ? response.company.personal_doc : [];
        this.experian_doc = response.company && response.company.experian_doc ? response.company.experian_doc : [];
        this.agreement_doc = response.company && response.company.agreement_doc ? response.company.agreement_doc : [];
        this.other_doc =response.company && response.company.other_doc ? response.company.other_doc : [];
        
        this.companyDetail_form.patchValue({
          company_name: response.company && response.company.company_name ? response.company.company_name : '',
          gstin: response.company && response.company.gstin ? response.company.gstin : '',
          district: response.company && response.company.district ? response.company.district : '',
          state: response.company && response.company.state ? response.company.state: '',
          pinCode: response.company && response.company.pincode ? response.company.pincode : '',
          industry_type: response.company && response.company.industry_type ? response.company.industry_type : '',
          cin: response.company && response.company.cin ? response.company.cin : '',
          tan: response.company && response.company.tan ? response.company.tan : '',
          pan: response.company && response.company.pan ? response.company.pan : '',
          annual_turnover: response.company && response.company.annual_turnover ? response.company.annual_turnover : '',
          xuriti_score: response.company && response.company.xuriti_score ? response.company.xuriti_score : 0,
          admin_name:
            response.company && response.company.createdBy && response.company.createdBy.first_name ? response.company.createdBy.first_name : '' +
            " " +
            response.company && response.company.createdBy && response.company.createdBy.last_name ? response.company.createdBy.last_name : '',
          status: response.company && response.company.status ? response.company.status : '',
          admin_email: response.company && response.company.createdBy && response.company.createdBy.email ? response.company.createdBy.email : '',
          admin_mobile: response.company && response.company.createdBy && response.company.createdBy.mobile_number ? response.company.createdBy.mobile_number : '',
          creditLimit: response.company && response.company.creditLimit ? response.company.creditLimit : 0,
          address: response.company && response.company.address ? response.company.address : '',
          company_email: response.company && response.company.company_email ? response.company.company_email : '',
          company_mobileNumber: response.company && response.company.company_mobile ? response.company.company_mobile : '',
          eNachMandate: response.company && response.company.eNachMandate ? response.company.eNachMandate : false,
          interest: response.company && response.company.interest ? response.company.interest : 0,
        });
      }
    });
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

  updateCompanyDetail() {
    if (this.companyDetail_form.valid && this.valueChangeFlag == true) {
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
          .updateCompanyDetails(this.companyid, this.companyDetail_form.value)
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
        "Please insert required fileds or make chages to edit.",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }
  }

  openCompanyApproveDialog(approvalFlag: boolean, companyid: string) {
    // this.dialog.open(CompanydetailsapproveDialog, {
    //   data: {
    //     companyid: this.companyid,
    //     approvalFlag: approvalFlag,
    //   },
    // });
  }

  openCompanyEditDialog() {
    this.dialog.open(CompanydetailseditDialog);
  }

  openCompanyDeleteDialog() {
    // this.dialog.open(CompanydetailsdeleteDialog);
  }

  companiesByStatus(event: any) {}
}

// ========================================================================

// @Component({
//   selector: 'companydetailsapprove-dialog',
//   templateUrl: 'companydetailsapprove-dialog.html',
//   styleUrls: ['./companydetails.component.scss'],
// })
// export class CompanydetailsapproveDialog implements OnInit {

//   durationInSeconds = 2;

//   companyApproval_form!: FormGroup;

//   constructor(
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private fb: FormBuilder,
//     private router: Router,
//     private snackBar: MatSnackBar,
//     public dialogRef: MatDialogRef<CompanydetailsapproveDialog>,
//     private apiService: ApiService
//   ) { }

//   ngOnInit() {
//     this.companyApproval_form = this.fb.group({
//       comment: ["", [Validators.required]],
//     });
//   }

//   // onSubmit() {
//   //   if (this.companyApproval_form.valid) {
//   //     const statusBody: any = {
//   //       // companyid: companyid,
//   //       status: this.data.approvalFlag == true ? "Approved" : "Hold",
//   //       msg: this.companyApproval_form.value.comment,
//   //     };
//   //     this.apiService
//   //       .changeCompanyStatus(this.data.companyid, statusBody)
//   //       .subscribe((resp: any) => {
//   //         if (resp) {
//   //           if (resp.status == true) {
//   //             this.snackBar.open(
//   //               "Company Status is changed successfully",
//   //               "Close",
//   //               {
//   //                 duration: this.durationInSeconds * 3000,
//   //                 panelClass: ["error-dialog"],
//   //               }
//   //             );
//   //           } else {
//   //             this.snackBar.open(
//   //               "Unable to change the Company Status, Please try again after sometime",
//   //               "Close",
//   //               {
//   //                 duration: this.durationInSeconds * 3000,
//   //                 panelClass: ["error-dialog"],
//   //               }
//   //             );
//   //           }
//   //           this.router.navigate(["admin/companies"]);
//   //           this.dialogRef.close(resp);
//   //         }
//   //       });
//   //   }
//   // }
// }

// ==============================================================

@Component({
  selector: 'companydetailsedit-dialog',
  templateUrl: 'companydetailsedit-dialog.html',
  styleUrls: ['./companydetails.component.scss'],
})
export class CompanydetailseditDialog implements OnInit {

  verify_form!: FormGroup;

  durationInSeconds = 2;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    // public dialogRef: MatDialogRef<CompanydetailsapproveDialog>,
    public dialogRef: MatDialogRef<any>,
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
        .updateCompanyDetails(
          this.data.companyid,
          this.data.company_update_data
        )
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
