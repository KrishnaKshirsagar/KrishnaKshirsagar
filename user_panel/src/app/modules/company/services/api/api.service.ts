import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { BankAccount } from "src/app/shared/interfaces/results/bankaccount.interface";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  BaseUrl = environment.baseUrl;

  private token!: string;

  response: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  // ========= Dashboard ===============
  getUploadedInvoices(
    company_type: string,
    companyid: string,
    user_id: string
  ) {
    return this.http.get(
      this.BaseUrl +
        `ledger/invoices/dashboard?compid=${companyid}&type=${company_type}&user_id=${user_id}`
    );
  }

  getPendingInvoice(company_type: string, companyid: string, user_id: string) {
    return this.http.get(
      this.BaseUrl +
        `ledger/invoices/dashboard?compid=${companyid}&status=Pending&type=${company_type}&user_id=${user_id}`
    );
  }

  getConfirmedInvoice(
    company_type: string,
    companyid: string,
    user_id: string
  ) {
    return this.http.get(
      this.BaseUrl +
        `ledger/invoices/dashboard?compid=${companyid}&status=Confirmed&type=${company_type}&user_id=${user_id}`
    );
  }

  getOverdueInvoice(company_type: string, companyid: string, user_id: string) {
    return this.http.get(
      this.BaseUrl +
        `ledger/invoices/dashboard?compid=${companyid}&overdue_invoice=overdue&type=${company_type}&user_id=${user_id}`
    );
  }

  getPaidInvoice(company_type: string, companyid: string, user_id: string) {
    return this.http.get(
      this.BaseUrl +
        `ledger/invoices/dashboard?compid=${companyid}&status=Paid&type=${company_type}&user_id=${user_id}`
    );
  }

  getDraftInvoice(company_type: string, companyid: string, gstin: string) {
    return this.http.get(
      this.BaseUrl +
        `ledger/invoices/dashboard?compid=${companyid}&status=Draft&gstin=${gstin}&type=${company_type}`
    );
  }

  getPendingAmount(company_type: string, companyid: string, user_id: string) {
    return this.http.get(
      this.BaseUrl +
        `ledger/invoices/dashboard?compid=${companyid}&amount_pending=amount&type=${company_type}&user_id=${user_id}`
    );
  }

  getBarchartdata(company_type: string, companyid: string) {
    return this.http.get(
      this.BaseUrl +
        `ledger/companies/dashboard/${company_type}?cid=${companyid}`
    );
  }

  getCalendarData(month: any, year: any, companyid: string, userid: string) {
    return this.http.get(
      this.BaseUrl +
        `ledger/companies/calendar/?month=${month}&year=${year}&seller=${companyid}&user_id=${userid}`
    );
  }

  // ========= NBFC Dashboard ===========
  getInvoicesByNBFC_id(nbfc_id: string) {
    return this.http.get(this.BaseUrl + `nbfcs/${nbfc_id}/nbfc-invoices`);
  }

  getTotalPendingPayment(nbfc_id: string) {
    return this.http.get(this.BaseUrl + `nbfcs/${nbfc_id}/nbfc-dashboard`);
  }

  getNBFCCalendarData(month: any, year: any, nbfc_id: string) {
    return this.http.get(
      this.BaseUrl +
        `nbfcs/${nbfc_id}/nbfc-calendar?month=${month}&year=${year}`
    );
  }

  // =============== Company ====================

  fetchCompanyByUserid(userid: string) {
    return this.http.get(this.BaseUrl + `entity/entities/${userid}`);
  }

  getCompanyDetailsById(companyid: any): Observable<any> {
    //Company detail by id
    return this.http.get<any>(this.BaseUrl + `entity/entity/${companyid}`);
  }

  // checkCompaniesAccess
  checkCompaniesAccess(companyid: string, userid: any) {
    return this.http.get(this.BaseUrl + `entity/${companyid}/user/${userid}`);
  }

  evaluateCompany(data: any) {
    return this.http.post(this.BaseUrl + "/entity/evaluate", data);
  }

  // ====== KYC related APIs =================

  getkycDetails(data: any) {
    return this.http.post(this.BaseUrl + "kyc/kyc-approval", {
      ...data,
    });
  }

  getkyc(company_id: any) {
    return this.http.get(this.BaseUrl + `kyc/${company_id}/document`);
  }

  kycRequest(data: any) {
    //For Step 2
    return this.http.post(this.BaseUrl + "entity/onboard", data);
  }

  panverifyOcr(body: any) {
    return this.http.post(this.BaseUrl + "kyc/document-verify/pan-ocr", body);
  }

  panverify(body: any) {
    return this.http.post(this.BaseUrl + `kyc/document-verify/pan`, body);
  }

  createUrl(body: any) {
    return this.http.post(this.BaseUrl + `kyc/document-verify/ckyc`, body);
  }
  sendURL(body: any) {
    return this.http.post(
      this.BaseUrl + `kyc/phone-verification/send-url`,
      body
    );
  }
  getAadharCaptcha() {
    return this.http.get(this.BaseUrl + `kyc/ekyc-getcaptcha`);
  }

  generateAadharOTP(body: any) {
    return this.http.post(this.BaseUrl + `kyc/ekyc-verifyCaptcha`, body);
  }

  verifyAadharOTP(body: any) {
    return this.http.post(this.BaseUrl + `kyc/ekyc-verifyOtp`, body);
  }

  aadharOCR(body: any) {
    return this.http.post(this.BaseUrl + `kyc/document-verify/aadhaar`, body);
  }

  mobileVerificationRequestOTP(body: any) {
    return this.http.post(
      this.BaseUrl + `kyc/phone-verification/request-otp`,
      body
    );
  }

  mobileVerification(body: any) {
    return this.http.post(
      this.BaseUrl + `kyc/phone-verification/verify-otp`,
      body
    );
  }

  getAssociatedCompaniesByCompanyId(body: any) {
    let urlStr: string = this.BaseUrl + `entity/entity/${body.id}/${body.type}`;
    let firstEle = true;
    let requestOptions = {};

    if (
      body.id == "All" &&
      body.user_id !== null &&
      body.user_id != undefined
    ) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "user_id=" + body.user_id;
    }

    if (body.company_name !== null && body.company_name != undefined) {
      const headerDict = {
        loader_flag: "false",
      };
      requestOptions = {
        headers: new HttpHeaders(headerDict),
      };

      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "company_name=" + body.company_name;
    }

    if (body.gstin !== null && body.gstin != undefined) {
      const headerDict = {
        loader_flag: "false",
      };
      requestOptions = {
        headers: new HttpHeaders(headerDict),
      };
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "gstin=" + body.gstin;
    }
    return this.http.get(urlStr, requestOptions);
  }

  // ====================

  // User management service
  getUserByUserid(userid: string, companyid: string) {
    // <===== Not req now
    return this.http.get(
      this.BaseUrl + `user/getuser/${userid}/company/${companyid}`
    );
  }

  getUsersByCompanyId(companyid: string, filter: any) {
    let requestOptions = {};
    let urlStr: string = this.BaseUrl + `user/user/${companyid}`;
    let firstEle = true;
    if (filter.user_name) {
      const headerDict = {
        loader_flag: "false",
      };
      requestOptions = {
        headers: new HttpHeaders(headerDict),
      };
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
      }
      urlStr += `user_name=${filter.user_name}`;
    }
    return this.http.get(urlStr, requestOptions);
  }

  resendInvite(data: any) {
    return this.http.post(
      this.BaseUrl + `user/adduser/${data.companyid}`,
      data
    );
  }

  addUser(companyid: string, userData: any) {
    return this.http.post(this.BaseUrl + `user/adduser/${companyid}`, userData);
  }

  editUser(userid: string, companyid: string, userData: any) {
    return this.http.put(
      this.BaseUrl + `/user/user/${userid}/company/${companyid}`,
      userData
    );
  }

  deleteUser(userid: string, companyid: string) {
    return this.http.delete(
      this.BaseUrl + `user/user/${userid}/company/${companyid}`
    );
  }

  // Bank management services
  deleteBankAccount(id: string) {
    return this.http.delete(this.BaseUrl + `payment/bankaccount/${id}`);
  }

  defaultBankAccount(companyid: string, id: string) {
    return this.http.patch(
      this.BaseUrl + `payment/bankaccount/${companyid}/${id}`,
      ""
    );
  }

  fetchBankAccountsByCompanyId(companyid: string) {
    return this.http.get<BankAccount>(
      this.BaseUrl + `payment/bankaccount/${companyid}`
    );
  }

  addBankAccount(companyid: string, accountData: any) {
    return this.http.post(
      this.BaseUrl + `payment/bankaccount/${companyid}`,
      accountData
    );
  }

  getIp() {
    return this.http.get(`${this.BaseUrl}auth`);
  }
}
