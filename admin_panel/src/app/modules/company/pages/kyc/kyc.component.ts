import { Component, OnInit,ViewChild ,ElementRef} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiService } from "../../services/api/api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-kyc",
  templateUrl: "./kyc.component.html",
  styleUrls: ["./kyc.component.scss"],
})

export class KycComponent implements OnInit {
  ckyc_link_flag: boolean = false;

  ckyc_link: string = '';

  companyDetails:any;

  KYCDetails!:any;

  mobile_ref_number!: string;

  companyid!: string;

  aadhar_captcha!: string;

  aadhar_sessionid!: string;

  panFile :any= [];

  panUrl :any = [];

  pan_verified_flag: boolean = false;

  aadhar_verified_flag: boolean = false;

  mobile_verified_flag: boolean = false;

  step1_complete_status: boolean = false;

  addressUrl :any = [];

  adharFrontFile:any  = [];

  adharFrontUrl:any = [];

  adharBackFile:any = [];

  isLinear: boolean = false;

  adharBackUrl:any = [];

  businessUrl:any = [];

  businessfile:any = [];

  financialUrl:any = [];

  vintageUrl:any = [];

  gstUrl:any = [];

  partnershipUrl:any = [];

  ownershipUrl:any = [];

  bankingUrl:any = [];

  doc1:any = [];

  doc2:any = [];

  doc3:any = [];

  urls = new Array<string>();
  cheque_urls = new Array<string>();

  srcResult: any;
  verify_form!: FormGroup;
  pandtails: any = {};
  durationInSeconds: number = 2;
  document_form!: FormGroup;
  ownershipFile!: any[];
  vintageFile!: any[];
  partnershipFile!: any[];
  bankingFile!: any[];
  finance_doc_1_Url!: any[];
  finance_doc_2_Url!: any[];
  finance_doc_3_Url!: any[];
  gstDoc: any;
  gsturls!: any[];
  business_verify_flag: boolean = false;
  ownership_verify_flag: boolean = false;
  vintage_verify_flag: boolean = false;
  partnership_verify_flag: boolean = false;
  banking_verify_flag: boolean = false;
  financial_verify_flag: boolean = false;
  shop_imp!: any[];
  cheque_imp!: any[];
  submit_flag = false;
  business_proof_details: any = {};
  ownership_proof_details: any = {};
  vintage_proof_details: any = {};
  firm_partnership_details: any = {};
  banking_details: any = {};
  Financial_and_gst_returns: any = {};
  storeDetails: any = {};
  pan_details: any = {};
  Aadhar_details: any = {};
  financialUrls!: any[];
  shop_imp_flag: boolean = false;
  cheque_imp_flag: boolean = false;
  input_check_flag: boolean = false;
  aadhar_captured_flag: boolean = false;
  userid: any;
  company_data: any = {};
  otp_flag: boolean = false;
  cheque_image_flag: boolean = false;
  cheque_url: any[] = [];
  mobile_otp_flag: boolean = false;

  backpage(){
         this.location.back();
  }

  onFileSelected() {
    const inputNode: any = document.querySelector("#file");

    if (typeof FileReader !== "undefined") {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.srcResult = e.target.result;
      };

      reader.readAsArrayBuffer(inputNode.files[0]);
    }
  }

  changeEvent(event: any) {
    if (event && event.target && event.target.id) {
      switch (event.target.id) {
        case "panInput":
          this.panFile = [];
          this.panFile.push(event.target.files[0]);
          this.panUrl = [];
          if (this.panFile) {
            for (let file of this.panFile) {
              let reader = new FileReader();
              reader.onload = (e: any) => {
                this.panUrl.push(e.target.result);
              }
              reader.readAsDataURL(file);
            }
          }
          break;

        case "adharFront":
          this.adharFrontFile = [];
          this.adharFrontFile.push(event.target.files[0]);
          this.adharFrontUrl = []; // adharFrontUrl
          if (this.adharFrontFile) {
            for (let file of this.adharFrontFile) {
              let reader = new FileReader();
              reader.onload = (e: any) => {
                this.adharFrontUrl.push(e.target.result);
              }
              reader.readAsDataURL(file);
            }
          }
          break;

        case "adharBack":
          this.adharBackFile = [];
          this.adharBackFile.push(event.target.files[0]);
          this.adharBackUrl = []; // adharBackUrl

          if (this.adharBackFile) {
            for (let file of this.adharBackFile) {
              let reader = new FileReader();
              reader.onload = (e: any) => {
                this.adharBackUrl.push(e.target.result);
              }
              reader.readAsDataURL(file);
            }
          }
          break;
        case "business":
          this.businessfile = [];
          this.businessfile.push(event.target.files[0]);
          this.businessUrl = [];
          if (this.businessfile) {
            for (let file of this.businessfile) {
              let reader = new FileReader();
              reader.onload = (e: any) => {
                this.businessUrl.push(e.target.result);
              }
              reader.readAsDataURL(file);
            }
          }
          break;
        case "ownership":
          this.ownershipFile = [];
          this.ownershipFile.push(event.target.files[0]);
          this.ownershipUrl = [];
          if (this.ownershipFile) {
            for (let file of this.ownershipFile) {
              let reader = new FileReader();
              reader.onload = (e: any) => {
                this.ownershipUrl.push(e.target.result);
              }
              reader.readAsDataURL(file);
            }
          }
          break;
        case "vintage":
          this.vintageFile = [];
          this.vintageFile.push(event.target.files[0]);
          this.vintageUrl = [];
          if (this.vintageFile) {
            for (let file of this.vintageFile) {
              let reader = new FileReader();
              reader.onload = (e: any) => {
                this.vintageUrl.push(e.target.result);
              }
              reader.readAsDataURL(file);
            }
          }
          break;
        case "partner":
          this.partnershipFile = [];
          this.partnershipFile.push(event.target.files[0]);
          this.partnershipUrl = [];
          if (this.partnershipFile) {
            for (let file of this.partnershipFile) {
              let reader = new FileReader();
              reader.onload = (e: any) => {
                this.partnershipUrl.push(e.target.result);
              }
              reader.readAsDataURL(file);
            }
          }
          break;
        case "banking":
          this.bankingFile = [];
          this.bankingFile.push(event.target.files[0]);
          this.bankingUrl = [];
          if (this.bankingFile) {
            for (let file of this.bankingFile) {
              let reader = new FileReader();
              reader.onload = (e: any) => {
                this.bankingUrl.push(e.target.result);
              }
              reader.readAsDataURL(file);
            }
          }
          break;

        case "financial_file":
          this.financialUrl = [];
          for (var i = 0; i < event.target.files.length; i++) {
            this.financialUrl.push(event.target.files[i]);
          }

          this.financialUrls = [];
          let filess = event.target.files;

          if (filess) {
            for (let file of filess) {
              let reader = new FileReader();
              reader.onload = (e: any) => {
                this.financialUrls.push(e.target.result);
              }
              reader.readAsDataURL(file);
            }
          }
          break;
        case "gst_file":
          this.gstUrl = [];
          for (var i = 0; i < event.target.files.length; i++) {
            this.gstUrl.push(event.target.files[i]);
          }

          this.gsturls = [];
          let files = event.target.files;

          if (files) {
            for (let file of files) {
              let reader = new FileReader();
              reader.onload = (e: any) => {
                this.gsturls.push(e.target.result);
              }
              reader.readAsDataURL(file);
            }
          }
          break;
        case "imageInput":
          this.shop_imp = [];
          if (event.target.files.length > 3) {
            this.shop_imp = [];
            this.urls = [];
            (<HTMLInputElement>document.getElementById('imageInput')).value = "";
            this.snackBar.open(
              "Please select maximum three images",
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          }
          else{
            for (var i = 0; i < event.target.files.length; i++) {
              this.shop_imp.push(event.target.files[i]);
            }
            this.urls = [];
            let img = event.target.files;
  
            if (img) {
              for (let file of img) {
                let reader = new FileReader();
                reader.onload = (e: any) => {
                  this.urls.push(e.target.result);
                }
                reader.readAsDataURL(file);
              }
            }
          }
        break;
        case "chequeInput": 
        this.cheque_imp = [];
        if (event.target.files.length > 3) {
          this.cheque_imp = [];
          this.cheque_url = [];
          (<HTMLInputElement>document.getElementById('chequeInput')).value = "";
          this.snackBar.open(
            "Please select maximum three images",
            "Close",
            {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            }
          );
        }
        else{
          for (var i = 0; i < event.target.files.length; i++) {
            this.cheque_imp.push(event.target.files[i]);
          }
          this.cheque_url = [];
          let img = event.target.files;
          if (img) {
            for (let file of img) {
              let reader = new FileReader();
              reader.onload = (e: any) => {
                this.cheque_url.push(e.target.result);
              }
              reader.readAsDataURL(file);
            }
          }
        }
          break;
        default:
          break;
      }
    }
  }

  addOnBlur = true;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private route : ActivatedRoute,
    private location : Location,
  ) {
  }

  ngOnInit(): void {
    this.userid = sessionStorage.getItem("LoginId");

    this.route.queryParams.subscribe((params:any) => {
      this.companyid = JSON.parse(params["companyid"]);
    });

    if (this.companyid) {
     this.companyDetailsByCid() 
    }

    this.verify_form = this.fb.group({
      panDetails: this.fb.group({
        panNumber: ["", [Validators.required, Validators.pattern]],
        documentList: ["", [Validators.required]],
      }),

      AddressProof: this.fb.group({
        captcha: ["", [Validators.required]],
        aadhar_otp: ["", [Validators.required]],
        addressDocNumber: ["", [Validators.required, Validators.pattern]],
        adharFrontFile: ["", [Validators.required]],
        adharBackFile: ["", [Validators.required]],
      }),

      mobileVerify: this.fb.group({
        mobile_number: ["", [Validators.required,Validators.pattern,Validators.maxLength(10),Validators.minLength(10)]],
        mobile_verification_otp: ["", [Validators.required,Validators.pattern,Validators.maxLength(6),Validators.minLength(4)]],
      }),
      ckycVerify: this.fb.group({
        ckyc_link:[""],
        gstin_Number: ["",Validators.required],
        company_name: ["",Validators.required],
        mobile_number: ["", [Validators.required,Validators.pattern,Validators.maxLength(10),Validators.minLength(10)]],
      })
    })

    this.document_form = this.fb.group({
      businessProof: this.fb.group({
        businessDocType: ["", [Validators.required]],
        businessDocNumber: ["", [Validators.required,Validators.pattern]],
        documentList: ["", [Validators.required]],
      }),
      ownershipProof: this.fb.group({
        ownershipDocType: ["", [Validators.required]],
        ownershipDocNumber: ["", [Validators.required,Validators.pattern]],
        documentList: ["", [Validators.required]],
      }),
      vintageProof: this.fb.group({
        businessvintageProof: ["", [Validators.required]],
        documentList: ["", [Validators.required]],
      }),
      partnershipDetails: this.fb.group({
        documentList: ["", [Validators.required]],
      }),

      bankingDetails: this.fb.group({
        bankstatementPassword: ['', [Validators.pattern]],
        documentList: ["", [Validators.required]],
      }),
      financialDetails: this.fb.group({
        financialDocList: ["", [Validators.required]],
        gstDocList: ["", [Validators.required]],
      }),
      shop_img: ["", [Validators.required]],
      cheque_img: ["", [Validators.required]],
    })

    this.refreshCaptcha();
    this.getKYCdetails();
    this.step1CompletionCheck();
  }

  companyDetailsByCid() {
    this.apiService.getCompany(this.companyid).subscribe((response: any) => {
      this.company_data.admin_mobile = response?.company?.admin_mobile
      this.company_data.company_name = response?.company?.company_name
      this.company_data.gst_number = response?.company?.gstin 
    })
  }

  getKYCdetails() {
    this.apiService.getkyc(this.companyid).subscribe((r: any) => {
      if (r && r.status == true) {
        this.KYCDetails = r.data; 
        this.pan_verified_flag = r.data.pan.verified;
        this.aadhar_verified_flag = r.data.aadhar.verified;
        this.mobile_verified_flag = r.data.mobile.verified;
        this.step1CompletionCheck();

        this.business_verify_flag = r && r.data && r.data.business && r.data.business.files ? true : false
        this.ownership_verify_flag = r && r.data && r.data.ownership && r.data.ownership.files ? true : false
        this.vintage_verify_flag = r && r.data && r.data.vintage && r.data.vintage.files ? true : false
        this.partnership_verify_flag = r && r.data && r.data.partnership && r.data.partnership.files ? true : false
        this.banking_verify_flag = r && r.data && r.data.bankStatement && r.data.bankStatement.files ? true : false
        this.financial_verify_flag = r && r.data && r.data.financial && r.data.financial.files ? true : false
        this.shop_imp_flag = r && r.data && r.data.storeImages && r.data.storeImages.files ? true : false
        this.cheque_imp_flag = r && r.data && r.data.chequeImages && r.data.chequeImages.files ? true : false
        
        if (
          this.pan_verified_flag == true &&
          this.aadhar_verified_flag == true &&
          this.mobile_verified_flag == true &&
          this.business_verify_flag == true &&
          this.ownership_verify_flag == true &&
          this.vintage_verify_flag == true &&
          this.partnership_verify_flag == true &&
          this.banking_verify_flag == true &&
          this.financial_verify_flag == true
        ) {
          this.submit_flag = true
        }

        if (r.data.mobile.number) {
          this.input_check_flag = true
        }

        this.pan_details.panlink = r.data && r.data.pan && r.data.pan.files ? r.data.pan.files : false;
        this.Aadhar_details.aadharlink = r.data && r.data.aadhar && r.data.aadhar.files ? r.data.aadhar.files : false;
        this.business_proof_details.business_proof_link = r.data.business.files;
        this.ownership_proof_details.ownershipProofLink = r.data && r.data.ownership && r.data.ownership.files ? r.data.ownership.files : false;
        this.vintage_proof_details.VintageProofLink = r.data && r.data.vintage && r.data.vintage.files ? r.data.vintage.files : false;
        this.firm_partnership_details.PartnershipLink = r.data && r.data.partnership && r.data.partnership.files ? r.data.partnership.files : false;
        this.banking_details.BankStatementDetailsLink = r.data && r.data.bankStatement && r.data.bankStatement.files ? r.data.bankStatement.files : false;
        this.Financial_and_gst_returns.FinancialDetailsLink = r.data && r.data.financial && r.data.financial.files ? r.data.financial.files : false;
        this.Financial_and_gst_returns.GstDetailsLink = r.data && r.data.gst && r.data.gst.files ? r.data.gst.files : false;
        this.storeDetails.images = r.data && r.data.storeImages && r.data.storeImages.files ? r.data.storeImages.files : false;
        this.companyDetails =this.company_data;
        console.log(this.companyDetails)
        this.verify_form.patchValue({
          panDetails: {
            panNumber: r.data.pan.number,
          },
          AddressProof: {
            addressDocNumber: r.data.aadhar.number,
          },
          mobileVerify: {
            mobile_number: r.data.mobile.number,
          },
          ckycVerify:{
            gstin_Number:this.companyDetails.gst_number,
            company_name: this.companyDetails.company_name,
            mobile_number: this.companyDetails.admin_mobile,
          }
        })
  
        this.document_form.patchValue({

          businessProof: {
            businessDocType: r.data.business.documentType,
            businessDocNumber: r.data.business.documentNumber,
          },

          ownershipProof: {
            ownershipDocType: r.data.ownership.documentType,
            ownershipDocNumber: r.data.ownership.documentNumber,
          },

          vintageProof: {
            businessvintageProof: "businessVinatgeProof",
          },
        })
      }
    })
  }

 refreshCaptcha() {
    this.getAadharCaptcha();
  }

  AadharCaptured_data(){
    var formData = new FormData();
      formData.append("company_id", this.companyid);
      formData.append("front", this.adharFrontFile[0])
      formData.append("back", this.adharBackFile[0])

      if (this.adharFrontFile[0] != undefined && this.adharBackFile[0] != undefined) {
        this.apiService.aadharOCR(formData).subscribe((re: any) => {
          if (re && re.status == true) {
            this.aadhar_captured_flag = true;
            this.Aadhar_details.number = re && re.data && re.data.summary && re.data.summary.number ? re.data.summary.number : "";
            this.Aadhar_details.holder = re && re.data && re.data.summary && re.data.summary.name ? re.data.summary.name : "";
            this.Aadhar_details.gender = re && re.data && re.data.summary && re.data.summary.gender ? re.data.summary.gender : "";
            this.Aadhar_details.dob    = re && re.data && re.data.summary && re.data.summary.dob ? re.data.summary.dob : "";
            this.Aadhar_details.address = re && re.data && re.data.summary && re.data.summary.address ? re.data.summary.address : "";
            this.step1CompletionCheck();
            this.getKYCdetails();
          }
          else{
            this.aadhar_captured_flag = false;
            this.snackBar.open(
              re.message,
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          }
        })
      }
      else
      {
        this.snackBar.open(
          "Please upload front and back side Aadhaar images",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      }
  }

  verifypan() {
    var body = new FormData();
    body.append("company_id", this.companyid);
    body.append("pan_number", this.verify_form.value.panDetails.panNumber)
    
    var panocr = new FormData();
    panocr.append("company_id", this.companyid);
    this.panFile.forEach((element: any) => {
      panocr.append("pan", element,element.name);
    })

    if (!this.verify_form.value.panDetails.panNumber && !this?.verify_form?.value?.panDetails?.documentList) {
      this.snackBar.open(
        "Please upload PAN image and enter valid PAN number",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }

   else if (!this.verify_form.value.panDetails.panNumber) {
      this.snackBar.open(
        "Please valid PAN number",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }

   else if (!this?.verify_form?.value?.panDetails?.documentList) {
      this.snackBar.open(
        "Please upload PAN image",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }
    if 
      (this?.verify_form?.value?.panDetails?.panNumber?.match(/[A-Z]{5}[0-9]{4}[A-Z]$/) ) {
        this.apiService.panverifyOcr(panocr).subscribe((res:any)=>{
          if (res.status == true) {
            this.apiService.panverify(body).subscribe((res: any) => {
              if (res.status == true) {
                this.step1CompletionCheck();
                this.pandtails.panholder = res.data.data.name;
                this.pandtails.pan_number = res.data.data.number;
                this.pandtails.verification = res.data.status;
                this.pan_verified_flag = true;
                this.getKYCdetails();
              } else {
                this.pan_verified_flag = false;
                this.snackBar.open(res.message, "Close", {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                });
              }
              this.getKYCdetails();
            });
          } 
          else {
            this.snackBar.open("Unable to capture data, Please try again.", "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
          }      
        })
    }

    else
     {
      this.snackBar.open(
        "Please enter valid PAN number",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }
  }

  getAadharCaptcha() {
    this.apiService.getAadharCaptcha().subscribe((respo: any) => {
      if (respo && respo.status == true) {
        this.aadhar_captcha = respo.data;
        this.aadhar_sessionid = respo.sessionId;
      } else {
        this.snackBar.open(
          respo.message,
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      }
    })
  }

  generateAadharOTP() {
    if (!this.verify_form.value.AddressProof.addressDocNumber && !this.verify_form.value.AddressProof.captcha) {
      this.snackBar.open(
        "Please enter all details for generate OTP",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }
    else if (!this.verify_form.value.AddressProof.addressDocNumber) {
      this.snackBar.open(
        "Please enter Aadhaar number for generate OTP",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }
    else if (!this.verify_form.value.AddressProof.captcha) {
      this.snackBar.open(
        "Please enter captcha for generate OTP",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }
    else 
    {
      if (this.verify_form.value.AddressProof.addressDocNumber.length == 12) {
        const body = {
          uid: this.verify_form.value.AddressProof.addressDocNumber,
          security_code: this.verify_form.value.AddressProof.captcha,
          sessionId: this.aadhar_sessionid,
        }
        this.apiService.generateAadharOTP(body).subscribe((respon: any) => {
          if (respon && respon.status == true) {
            this.otp_flag = true;
            this.snackBar.open(
              respon.message,
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          } else {
            this.otp_flag = false;
            this.getAadharCaptcha();
            this.snackBar.open(
              respon.message,
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          }
        })
      }
      else
      {
        this.snackBar.open(
          "Please enter valid Aadhaar number for generate OTP",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      }
    }
  }

  verifyAadharOTP() {
    if (this.verify_form.value.AddressProof.addressDocNumber
      && this.verify_form.value.AddressProof.captcha
      && this.verify_form.value.AddressProof.aadhar_otp
    ) {
      const body = 
      {
        otp: this.verify_form.value.AddressProof.aadhar_otp,
        sessionId: this.aadhar_sessionid
      }

       if ((this.verify_form.value.AddressProof.aadhar_otp.length == 4) || (this.verify_form.value.AddressProof.aadhar_otp.length == 6)) {
        this.apiService.verifyAadharOTP(body).subscribe((respons: any) => {
          if (respons && respons.status == true) {
            this.aadhar_verified_flag = true;
            this.step1CompletionCheck();
            this.getKYCdetails();
  
          } else {
            this.snackBar.open(
              respons.message,
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          }
        })
       }
       else
       {
        this.snackBar.open(
          "Please enter valid OTP",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
       }
    } else {
      this.snackBar.open(
        "Please enter OTP",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }
  }
 
  onChange(value: any){
    let input_value = (value.target as HTMLInputElement).value;
    if (input_value.length == 10) {
      if (!input_value.match(/^[0-9.]*$/)) {
        this.input_check_flag = false
      }
      else {
        this.input_check_flag = true
      }
    }
    else{
      this.input_check_flag = false
    }  
  }

  onMobileOTPChange(value: any){
    let input_value = (value.target as HTMLInputElement).value;
    if (input_value.length == 4 || input_value.length == 6) {
      if (!input_value.match(/^[0-9.]*$/)) {
        this.mobile_otp_flag = false
      }
      else {
        this.mobile_otp_flag = true
      }
    }
    else{
      this.mobile_otp_flag = false
    }  
  }


  generateOTP() {
    if (this.verify_form.value.mobileVerify.mobile_number) {
      const body = {
        mobile_number: this.verify_form.value.mobileVerify.mobile_number
      }
      this.apiService.mobileVerificationRequestOTP(body).subscribe((res: any) => {
        if (res && res.status == true) {
          this.mobile_ref_number = res.data && res.data.referenceId ? res.data.referenceId : '';
        } else {
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

  verifyMobileNumber() {
    if (this.verify_form.value.mobileVerify.mobile_number
      && this.verify_form.value.mobileVerify.mobile_verification_otp) {
      const body = {
        mobile_number: this.verify_form.value.mobileVerify.mobile_number,
        otp: this.verify_form.value.mobileVerify.mobile_verification_otp,
        referenceId: this.mobile_ref_number,
        company_id: this.companyid != undefined && this.companyid != null ? this.companyid : ''
      }
      this.apiService.mobileVerification(body).subscribe((resp: any) => {
        if (resp && resp.status == true) {
          this.mobile_verified_flag = true;
          this.step1CompletionCheck();
          this.snackBar.open(
            "Mobile number successfully verified",
            "Close",
            {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            }
          );
          this.getKYCdetails();
        } else {
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
    else{
      this.snackBar.open(
        "Please enter your OTP",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }
  }

  step1CompletionCheck() {
    if (this.pan_verified_flag == true
      // && this.aadhar_verified_flag == true
      && this.mobile_verified_flag == true
    ) {
      this.step1_complete_status = true;
      this.isLinear = false;
    } else {
      this.step1_complete_status = false;
    }
  }

  goForward(stepper: MatStepper) {
         if (this.submit_flag == true) {
          stepper.next();
          this.snackBar.open(
            "Thank you for registering with Xuriti. Our team will complete the KYC formalities.",
            "Close",
            {
              duration: 5 * 3000,
              panelClass: ["error-dialog"],
            }
          );
        }
        else{
          this.snackBar.open(
            "Please complete all the KYC to proceed next step.",
            "Close",
            {
              duration: 5 * 3000,
              panelClass: ["error-dialog"],
            }
          );
        }
      }
  // Business Document upload
  
  uploadBusinessDoc()
  { 
    let form = new FormData();
      form.append("userID", this.userid);
      form.append("companyId", this.companyid);

    if (
      this.document_form.value && this.document_form.value.businessProof
      && this.document_form.value.businessProof.businessDocType
      && (this.document_form.value.businessProof.businessDocNumber.match(/^[a-zA-Z0-9_-]*$/) 
      &&  this.document_form.value.businessProof.businessDocNumber != "")
      && this.document_form.value.businessProof.documentList
      ) 
      { 
        form.append(
          "businessDocType",
          this.document_form.value.businessProof.businessDocType
        );
        form.append(
          "businessDocNumber",
          this.document_form.value.businessProof.businessDocNumber
        );
        this.businessfile.forEach((element:any) => {
          form.append("BusinessProof", element, element.name);
        });
  
        this.apiService.kycRequest(form).subscribe((res: any) => {
          if (res && res.status == true) {
            this.business_verify_flag = true
            this.verify_super_flag()
            this.snackBar.open(
              "Business document uploaded successfully",
              "Close",
              {
                duration: 5 * 3000,
                panelClass: ["error-dialog"],
              }
            );
            this.getKYCdetails()
          }
          else {
            this.snackBar.open(res.message, "Close", {
              duration: 5 * 3000,
              panelClass: ["error-dialog"],
            });
          }
        });
      }
    else{
      this.snackBar.open(
        "Please add all valid business documents",
        "Close",
        {
          duration: 5 * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }    
  }
  
  // Ownership Document upload
  uploadOwnershipDoc(){
    let form = new FormData();
      form.append("userID", this.userid);
      form.append("companyId", this.companyid);

    if (
      this.document_form.value && this.document_form.value.ownershipProof
      && this.document_form.value.ownershipProof.ownershipDocType
      && (this.document_form.value.ownershipProof.ownershipDocNumber.match(/^[a-zA-Z0-9_-]*$/)
       && this.document_form.value.ownershipProof.ownershipDocNumber != "")
      && this.document_form.value.ownershipProof.documentList
      ) 
      { 
        form.append(
        "ownershipDocType",
        this.document_form.value.ownershipProof.ownershipDocType
      ),
        form.append(
          "ownershipDocNumber",
          this.document_form.value.ownershipProof.ownershipDocNumber
        ),
        this.ownershipFile.forEach((element) => {
          form.append("propertyOwnership", element, element.name);
        });
  
        this.apiService.kycRequest(form).subscribe((res: any) => {
          if (res && res.status == true) {
            this.ownership_verify_flag = true
            this.verify_super_flag()
            this.snackBar.open(
              "Ownership document uploaded successfully",
              "Close",
              {
                duration: 5 * 3000,
                panelClass: ["error-dialog"],
              }
            );
            this.getKYCdetails()
          }
          else {
            this.snackBar.open(res.message, "Close", {
              duration: 5 * 3000,
              panelClass: ["error-dialog"],
            });
          }
        });
      }
    else{
      this.snackBar.open(
        "Please add all valid ownership documents",
        "Close",
        {
          duration: 5 * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }    
  }

  // vintage Document upload
  uploadVintageDoc(){
    let form = new FormData();
    form.append("userID", this.userid);
    form.append("companyId", this.companyid);

    if ( this.document_form.value 
      && this.document_form.value.vintageProof
      && this.document_form.value.vintageProof.businessvintageProof
      && this.document_form.value.vintageProof.documentList)
      {
        form.append(
          "vintageProof",
          this.document_form.value.vintageProof.businessvintageProof
        ),
          this.vintageFile.forEach((element) => {
            form.append("VintageProof", element, element.name);
        });

        this.apiService.kycRequest(form).subscribe((res: any) => {
          if (res && res.status == true) {
            this.vintage_verify_flag = true
            this.verify_super_flag()
            this.snackBar.open(
              "Vintage document uploaded successfully",
              "Close",
              {
                duration: 5 * 3000,
                panelClass: ["error-dialog"],
              }
            );
            this.getKYCdetails()
          }
          else {
            this.snackBar.open(res.message, "Close", {
              duration: 5 * 3000,
              panelClass: ["error-dialog"],
            });
          }
        });
     }
     else{
      this.snackBar.open(
        "Please add all vintage documents",
        "Close",
        {
          duration: 5 * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }    
  }

  // * Firm/Partnership Details
  uploadfFirmPartnershipDoc(){
    let form = new FormData();
    form.append("userID", this.userid);
    form.append("companyId", this.companyid);

    if ( this.document_form.value 
      && this.document_form.value.partnershipDetails
      && this.document_form.value.partnershipDetails.documentList)
      {
        this.partnershipFile.forEach((element) => {
        form.append("PartnershipDetails", element, element.name);
       });

        this.apiService.kycRequest(form).subscribe((res: any) => {
          if (res && res.status == true) {
            this.partnership_verify_flag = true
            this.verify_super_flag()
            this.snackBar.open(
              "Firm/partnership document uploaded successfully",
              "Close",
              {
                duration: 5 * 3000,
                panelClass: ["error-dialog"],
              }
            );
            this.getKYCdetails()
          }
          else {
            this.snackBar.open(res.message, "Close", {
              duration: 5 * 3000,
              panelClass: ["error-dialog"],
            });
          }
        });
     }
     else{
      this.snackBar.open(
        "Please add firm and partnership documents",
        "Close",
        {
          duration: 5 * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }    
  }

  // * Banking Details
  uploadBankingDoc(){
    let form = new FormData();
    form.append("userID", this.userid);
    form.append("companyId", this.companyid);

    if ( this.document_form.value 
      && this.document_form.value.bankingDetails
      && this.document_form.value.bankingDetails.documentList)
      {
        this.bankingFile.forEach((element) => {
          form.append("BankStatementDetails", element, element.name);
        });
        form.append("bankStatementPassword", this.document_form.value.bankingDetails.bankstatementPassword);

        this.apiService.kycRequest(form).subscribe((res: any) => {
          if (res && res.status == true) {
            this.banking_verify_flag = true
            this.verify_super_flag()
            this.snackBar.open(
              "Banking document uploaded successfully",
              "Close",
              {
                duration: 5 * 3000,
                panelClass: ["error-dialog"],
              }
            );
            this.getKYCdetails()
          }
          else {
            this.snackBar.open(res.message, "Close", {
              duration: 5 * 3000,
              panelClass: ["error-dialog"],
            });
          }
        });
     }
     else{
      this.snackBar.open(
        "Please add banking documents",
        "Close",
        {
          duration: 5 * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }    
  }

  // * Financial & GST Returns (Upto 24 Months)
  uploadFinancialGstDoc(){
    let form = new FormData();
    form.append("userID", this.userid);
    form.append("companyId", this.companyid);

    if ( this.document_form.value 
      && this.document_form.value.financialDetails
      && this.document_form.value.financialDetails.financialDocList
      && this.document_form.value.financialDetails.gstDocList
      )
      {
        this.financialUrl.forEach((element:any) => {
          form.append("FinancialDetails", element, element.name );
        });
        this.gstUrl.forEach((element:any) => {
          form.append("GstDetails", element,element.name);
        });

        this.apiService.kycRequest(form).subscribe((res: any) => {
          if (res && res.status == true) {
            this.financial_verify_flag = true
            this.verify_super_flag()
            this.snackBar.open(
              "Financial and GST documents uploaded successfully",
              "Close",
              {
                duration: 5 * 3000,
                panelClass: ["error-dialog"],
              }
            );
            this.getKYCdetails()
          }
          else {
            this.snackBar.open(res.message, "Close", {
              duration: 5 * 3000,
              panelClass: ["error-dialog"],
            });
          }
        });
     }
     else{
      this.snackBar.open(
        "Please add all financial and GST documents",
        "Close",
        {
          duration: 5 * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }    
  }

  // * Upload Store Images
  uploadStoreImg(){
    let form = new FormData();
    form.append("userID", this.userid);
    form.append("companyId", this.companyid);
    if ( this.document_form.value 
      && this.urls.length != 0
      )
      {
        this.shop_imp.forEach((element)=>{
          form.append("StoreImages",element, element.name)
        })
        this.apiService.kycRequest(form).subscribe((res: any) => {
          if (res && res.status == true) {
            this.shop_imp_flag = true
            this.verify_super_flag()
            if (this.shop_imp.length == 1) {
              this.snackBar.open(
                "Store image uploaded successfully",
                "Close",
                {
                  duration: 5 * 3000,
                  panelClass: ["error-dialog"],
                }
              );
              this.getKYCdetails()
            }
            else
            {
              this.snackBar.open(
                "Store images uploaded successfully",
                "Close",
                {
                  duration: 5 * 3000,
                  panelClass: ["error-dialog"],
                }
              );
            }
          }
          else {
            this.snackBar.open(res.message, "Close", {
              duration: 5 * 3000,
              panelClass: ["error-dialog"],
            });
          }
        });
     }
     else{
      this.snackBar.open(
        "Please add store images",
        "Close",
        {
          duration: 5 * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }    
  }

  // * Upload Cheque Images
  uploadChequeImage(){
    let form = new FormData();
    form.append("userID", this.userid);
    form.append("companyId", this.companyid);
    if ( this.document_form.value 
      && this.cheque_url.length != 0
      )
      {
        this.cheque_imp.forEach((element)=>{
          form.append("ChequeImages",element, element.name)
        })
        this.apiService.kycRequest(form).subscribe((res: any) => {
          if (res && res.status == true) {
            this.cheque_image_flag = true
            this.verify_super_flag()
            if (this.cheque_imp.length == 1) {
              this.snackBar.open(
                "Cheque image uploaded successfully",
                "Close",
                {
                  duration: 5 * 3000,
                  panelClass: ["error-dialog"],
                }
              );
              this.getKYCdetails()
            }
            else{
              this.snackBar.open(
                "Cheque images uploaded successfully",
                "Close",
                {
                  duration: 5 * 3000,
                  panelClass: ["error-dialog"],
                }
              );
            }
          }
          else {
            this.snackBar.open(res.message, "Close", {
              duration: 5 * 3000,
              panelClass: ["error-dialog"],
            });
          }
        });
     }
     else{
      this.snackBar.open(
        "Please add cheque images",
        "Close",
        {
          duration: 5 * 3000,
          panelClass: ["error-dialog"],
        }
      );
    } 
  }

  verify_super_flag() {
    if (
      this.pan_verified_flag == true &&
      this.aadhar_verified_flag == true &&
      this.mobile_verified_flag == true &&
      this.business_verify_flag == true &&
      this.ownership_verify_flag == true &&
      this.vintage_verify_flag == true &&
      this.partnership_verify_flag == true &&
      this.banking_verify_flag == true &&
      this.financial_verify_flag == true &&
      this.shop_imp_flag == true &&
      this.cheque_imp_flag == true
    ) {
      this.submit_flag = true
    }
  }
  generateUrl(){
    
    var body = new FormData();
    body.append("company_id",this.companyid);
    if (!this.verify_form.value.ckycVerify.gstin_Number && !this.verify_form.value.ckycVerify.company_name && !this.verify_form.value.ckycVerify.mobile_number) {
      this.snackBar.open(
        "Please enter all details for generate URL",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
   }else if(this?.verify_form?.value?.ckycVerify?.gstin_Number !== this.companyDetails.gst_number  ) {
      this.ckyc_link_flag =false;      
      this.snackBar.open('Please Enter Valid GSTIN Number.', "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }else if(this?.verify_form?.value?.ckycVerify?.company_name !== this.companyDetails.company_name){
      this.ckyc_link_flag =false;      
      this.snackBar.open('Please Enter Valid Company Name.', "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }else if(!this.verify_form.value.ckycVerify.mobile_number){
      this.ckyc_link_flag =false;      
      this.snackBar.open('Please Enter Mobile Number', "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }else{
      this.apiService.createUrl(body).subscribe((res:any)=>{
        if(res && res.status == true){     
          this.ckyc_link_flag = true;
          this.verify_form.patchValue({
            ckycVerify:{
              ckyc_link : res.data.url
            }
          })
          this.ckyc_link = res.data.url
          this.sendsms(this.ckyc_link);
          this.snackBar.open('Link Generated Successfully and Send To Mobile.', "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }else{
          this.ckyc_link_flag = false;
          this.ckyc_link = '';
          this.snackBar.open(res.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }
      })

    }
  }

  sendsms(ckyc_link:any){
    var body = new FormData();
    body.append("company_id", this.companyid);
    if(this.verify_form.value.ckycVerify.mobile_number){
      body.append("mobile_number",this.verify_form.value.ckycVerify.mobile_number)  
    }else if(ckyc_link){
      body.append("url",ckyc_link)
    }
    this.apiService.sendURL(body).subscribe((res:any)=>{
    })
  }

  @ViewChild('txtConfigFile') txtConfigFile!: ElementRef;
  copyckycLink(){
  if (this.txtConfigFile) {
    // Select textarea text
    this.txtConfigFile.nativeElement.select();

    // Copy to the clipboard
    document.execCommand("copy");

    // Deselect selected textarea
    this.txtConfigFile.nativeElement.setSelectionRange(0, 0);
}
}
}
