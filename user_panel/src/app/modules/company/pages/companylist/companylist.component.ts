import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../services/api/api.service";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { MatPaginator } from "@angular/material/paginator";
import { LOCAL_STORAGE_AUTH_DETAILS_KEY } from "src/app/shared/constants/constants";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpClient } from "@angular/common/http";
import * as moment from 'moment';
@Component({
  selector: "app-companylist",
  templateUrl: "./companylist.component.html",
  styleUrls: ["./companylist.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class CompanylistComponent implements OnInit {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  seller_flag = "false";

  companyDetails: any = [];

  ho_user_flag = false;

  redirect!: string;

  private token!: string;

  userid!: string;

  companyid!: string;

  userLastLoginTime: string;

  ipAddress: string = "127.0.0.1";

  durationInSeconds = 2;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
    });
    const detailsStr = sessionStorage.getItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);
    if (detailsStr) {
      const details = JSON.parse(detailsStr);
      const userDetails = details.user;
      this.userid = userDetails._id;
      this.userLastLoginTime = moment(details.user.lastLogIn).format("DD-MMM-YYYY HH:mm:ss");
    }
    this.fetchCompanyByUserid();
    this.getIPAddress();
  }
  getIPAddress() {
    this.apiService.getIp().subscribe((res: any) => {
      console.log(res);
      if (res?.ip) {
        this.ipAddress = res.ip ? res.ip : "127.0.0.1";
      }
    });
  }

  fetchCompanyByUserid() {
    this.apiService.fetchCompanyByUserid(this.userid).subscribe((res: any) => {
      if (res && res.status == true) {
        const companies: any = res.company;
        this.companyDetails = companies;
        for (let element of this.companyDetails) {
          if (element.userRole == "HO_user") {
            this.ho_user_flag = true;
            break;
          }
        }
      }
    });
  }

  selectCompany(company: any) {
    if (company == "All") {
      this.companyid = "All";
      sessionStorage.setItem("Role", "HO_user");
      sessionStorage.setItem("companyid", this.companyid);
      sessionStorage.setItem("seller_flag", "true");
      this.router.navigate([`/companies/${this.companyid}/dashboard`]);
    } else {
      this.companyid = company?.company?._id;
      this.apiService
        .checkCompaniesAccess(this.companyid, this.userid)
        .subscribe((resp: any) => {
          if (resp && resp.status == true) {
            const _company =
              resp.company[0] && resp.company[0].Company
                ? resp.company[0].Company
                : [];
            if (resp.status == true) {
              //In-Progress Approved
              sessionStorage.setItem("Role", _company.userRole);
              sessionStorage.setItem("companyid", _company.company._id);
              sessionStorage.setItem("company_status", _company.company.status);
              this.seller_flag =
                _company.company && _company.company.seller_flag
                  ? _company.company.seller_flag
                  : false;
              sessionStorage.setItem("seller_flag", this.seller_flag);
              // if (_company.company.status == "In-Progress")
              this.router.navigate([
                `/companies/${_company.company._id}/dashboard`,
              ]);
            } else {
              sessionStorage.removeItem("companyid");
              sessionStorage.removeItem("Role");
              sessionStorage.removeItem("seller_flag");
              sessionStorage.removeItem("company_status");

              this.snackBar.open(
                `You are not allowed to perform any operation, ${_company.company.company_name} status is ${_company.company.status}. Please contact to Xuriti team`,
                "Close",
                {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                }
              );
            }
          } else {
            this.snackBar.open(resp.message, "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
          }
        });
    }
  }
}
