import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Validators } from "@angular/forms";
import { FormArray } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { ApiService } from "../../services/api/api.service";
import { LOCAL_STORAGE_AUTH_DETAILS_KEY } from "src/app/shared/constants/constants";

export interface Fruit {
  name: string;
}

@Component({
  selector: "app-credit",
  templateUrl: "./credit.component.html",
  styleUrls: ["./credit.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class CreditComponent implements OnInit {
  private fileList = [];
  newBankingDetailsForm: FormGroup = this.fb.group({
    accountNumber: this.fb.control(""),
    ifscCode: this.fb.control(""),
  });
  partnerDetailsForm: FormGroup = this.fb.group({
    partnerName: this.fb.control(""),
    parnterPan: this.fb.control(""),
    parnterAadhar: this.fb.control(""),
    parnterDesignation: this.fb.control(""),
    parnterAge: this.fb.control(""),
    parnterMobileNo: this.fb.control(""),
    partnerEmail: this.fb.control(""),

    accountNumber: this.fb.control(""),
    ifscCode: this.fb.control(""),
    creditLimit: this.fb.control(""),
  });

  profileForm = this.fb.group({
    individualDetails: this.fb.group({
      firstName: ["", Validators.required],
      lastName: [""],
      address: [""],
      aadharNo: [""],
      panNo: [""],
      age: [""],
    }),

    businessDetails: this.fb.group({
      businessType: [""],
      legalName: [""],
      tradeName: [""],
      centreJurisdiction: [""],
      stateJurisdiction: [""],
      taxpayerDate: [""],
      cancellationDate: [""],
      cMobile: [""],
      grossTotalIncome: [""],
      grossTotalIncomeYear: [""],
      regType: [""],
      cRegDate: [""],
      cEmail: [""],
      natureOfBusiness: [""],
      complianceRating: [""],
      taxpayerType: [""],
      estDate: [""],
      pAdrressType: [""],
      pStreet: [""],
      pLocality: [""],
      pPincode: [""],
      pCity: [""],
      pDistrict: [""],
      pState: [""],

      aStreet: [""],
      aLocality: [""],
      aPincode: [""],
      aCity: [""],
      aDistrict: [""],
      aState: [""],
      cPan: [""],
      employeeCount: [""],
      turnOver: [""],
      gstNumber: [""],
      dealershipCode: [""],
      relationShipDuration: [""],
      tanNo: [""],
      cinNo: [""],
      tinNo: [""],
      fillingDate: [""],
      fillingMethod: [""],
      gstType: [""],
      gstStatus: [""],
    }),
    partnerDetails: this.fb.array([this.partnerDetailsForm]),
    companyBankingDetails: this.fb.array([this.newBankingDetailsForm]),
    fileList: this.fb.array([]),
  });

  fetchGst() {
    console.log("fetch gst");
  }
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  fruits: Fruit[] = [];

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();

    // Add our fruit
    if (value) {
      this.fruits.push({ name: value });
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }
  get form() {
    return this.profileForm.controls;
  }

  get partnerDetails(): FormArray {
    return this.profileForm.get("partnerDetails") as FormArray;
  }

  get companyBankingDetails(): FormArray {
    return this.profileForm.get("companyBankingDetails") as FormArray;
  }

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    console.log(this.partnerDetails);
  }
  updateProfile() {}
  addCompanyBankAccount() {
    this.companyBankingDetails.push(this.newBankingDetailsForm);
  }

  addPartner() {
    this.partnerDetails.push(this.partnerDetailsForm);
  }

  ngOnInit(): void {}

  onSubmit() {
    var userid = "";
    const form = new FormData();
    const detailsStr = localStorage.getItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);
    if (detailsStr) {
      const details = JSON.parse(detailsStr);
      const userDetails = details.user;
      userid = userDetails._id;
    }

    form.append("userID", userid);
    form.append(
      "firstname",
      this.profileForm.value.individualDetails.firstName
    );
    form.append("lastName", this.profileForm.value.individualDetails.lastName);
    form.append("address", this.profileForm.value.individualDetails.address);
    form.append("aadharNo", this.profileForm.value.individualDetails.aadharNo);
    form.append("panNo", this.profileForm.value.individualDetails.panNo);
    form.append(
      "individualAge",
      this.profileForm.value.individualDetails.individualAge
    );
    form.append(
      "businessType",
      this.profileForm.value.businessDetails.businessType
    );
    form.append("legalName", this.profileForm.value.businessDetails.legalName);
    form.append("tradeName", this.profileForm.value.businessDetails.tradeName);
    form.append(
      "centreJurisdiction",
      this.profileForm.value.businessDetails.centreJurisdiction
    );
    form.append(
      "stateJurisdiction",
      this.profileForm.value.businessDetails.stateJurisdiction
    );
    form.append(
      "taxpayerDate",
      this.profileForm.value.businessDetails.taxpayerDate
    );
    form.append(
      "cancellationDate",
      this.profileForm.value.businessDetails.cancellationDate
    );
    form.append("cMobile", this.profileForm.value.businessDetails.cMobile);
    form.append(
      "grossTotalIncome",
      this.profileForm.value.businessDetails.grossTotalIncome
    );
    form.append(
      "grossTotalIncomeYear",
      this.profileForm.value.businessDetails.grossTotalIncomeYear
    );
    form.append("regType", this.profileForm.value.businessDetails.regType);
    form.append("cRegDate", this.profileForm.value.businessDetails.cRegDate);
    form.append("cEmail", this.profileForm.value.businessDetails.cEmail);
    form.append(
      "natureOfBusiness",
      this.profileForm.value.businessDetails.natureOfBusiness
    );
    form.append(
      "complianceRating",
      this.profileForm.value.businessDetails.complianceRating
    );
    form.append(
      "taxpayerType",
      this.profileForm.value.businessDetails.taxpayerType
    );
    form.append(
      "establishmentDate",
      this.profileForm.value.businessDetails.estDate
    );
    form.append(
      "pAddressType",
      this.profileForm.value.businessDetails.pAddressType
    );
    form.append("pStreet", this.profileForm.value.businessDetails.pStreet);
    form.append("pLocality", this.profileForm.value.businessDetails.pLocality);
    form.append("pPincode", this.profileForm.value.businessDetails.pPincode);
    form.append("pCity", this.profileForm.value.businessDetails.pCity);
    form.append("pDistrict", this.profileForm.value.businessDetails.pDistrict);
    form.append("pState", this.profileForm.value.businessDetails.pState);
    form.append("aStreet", this.profileForm.value.businessDetails.aStreet);
    form.append("aLocality", this.profileForm.value.businessDetails.aLocality);
    form.append("aPincode", this.profileForm.value.businessDetails.aPincode);
    form.append("aCity", this.profileForm.value.businessDetails.aCity);
    form.append("aDistrict", this.profileForm.value.businessDetails.aDistrict);
    form.append("aState", this.profileForm.value.businessDetails.aState);
    form.append("cPan", this.profileForm.value.businessDetails.cPan);
    form.append(
      "employeeCount",
      this.profileForm.value.businessDetails.employeeCount
    );
    form.append("turnOver", this.profileForm.value.businessDetails.turnOver);
    form.append("gstNumber", this.profileForm.value.businessDetails.gstNumber);
    form.append(
      "dealershipCode",
      this.profileForm.value.businessDetails.dealershipCode
    );
    form.append(
      "relationShipDuration",
      this.profileForm.value.businessDetails.relationShipDuration
    );
    form.append("tanNo", this.profileForm.value.businessDetails.tanNo);
    form.append("cinNo", this.profileForm.value.businessDetails.cinNo);
    form.append("tinNo", this.profileForm.value.businessDetails.tinNo);
    form.append(
      "fillingDate",
      this.profileForm.value.businessDetails.fillingDate
    );
    form.append(
      "fillingMethod",
      this.profileForm.value.businessDetails.fillingMethod
    );
    form.append("gstType", this.profileForm.value.businessDetails.gstType);
    form.append("gstStatus", this.profileForm.value.businessDetails.gstStatus);
    form.append("partnerData", this.profileForm.value.partnerDetails);
    form.append(
      "companyBankDetails",
      this.profileForm.value.companyBankingDetails
    );
    form.append("document", this.profileForm.value.fileList);

    this.apiService.evaluateCompany(form).subscribe((res: any) => {
      console.log(res);
    });
  }
}
