import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  BaseUrl = environment.baseUrl;

  private token!: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  invoicePaymentstatus(order: any) {
    return this.http.post(this.BaseUrl + `payment/webhooks`, order);
  }

  emandateStatus(companyid: any) {
    return this.http.get(this.BaseUrl + `payment/extendcredit/${companyid}`);
  }

  emandatewebhooks(companyid: String){
    return this.http.get(this.BaseUrl + `payment/extendcreditwebhook/${companyid}`);
  }
}
