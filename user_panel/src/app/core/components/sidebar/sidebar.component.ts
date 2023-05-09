import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { LOCAL_STORAGE_AUTH_DETAILS_KEY } from "src/app/shared/constants/constants";
import { animateText, onSideNavChange } from "../../animations/animations";
import { SidenavService } from "../../services/sidenav/sidenav.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
  animations: [onSideNavChange, animateText],
})
export class SidebarComponent implements OnInit {
  @Input() routes: {
    title: string;
    path: string;
    icon: string;
  }[] = [];

  username: string = "";

  seller_flag: string = "";

  dashboard: string = "";

  user_role!: string;

  nbfc_id!: string;

  companyName: string = "Switch Business";

  companyid: any;

  company_status!: string;

  accessFlag!: boolean;

  activeflag!: boolean;

  sideNavState = false;

  linkText = false;

  durationInSeconds = 2;

  constructor(
    private _sidenavService: SidenavService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // ================= For the access flag ==============================
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const routePath = this.router.url.split("?")[0];
        this.accessFlag =
          routePath === "/companies" ||
          routePath === "/register/entity" ||
          routePath === "/home";
      }
      if (!this.accessFlag) {
        this.getLoggedInUser();
      }
    });
  }

  getLoggedInUser() {
    this.user_role = sessionStorage.getItem("Role");
    this.company_status = sessionStorage.getItem("company_status");
    const detailsStr = sessionStorage.getItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);
    if (detailsStr) {
      const details = JSON.parse(detailsStr);
      const userDetails = details.user;
      if (userDetails.first_name && userDetails.last_name) {
        this.username = userDetails.first_name + " " + userDetails.last_name;
      }
    }
  }

  getNBFCid() {
    this.nbfc_id = sessionStorage.getItem("nbfc_id");
  }

  onSinenavToggle() {
    this.getCompanyid();
    this.sideNavState = !this.sideNavState;
    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200);
    this._sidenavService.sideNavState$.next(this.sideNavState);
  }

  openCompaniesPage() {
    sessionStorage.removeItem("seller_flag");
    sessionStorage.removeItem("company_status");
    this.router.navigate([`/companies/`]);
  }

  getCompanyid() {
    this.companyid = sessionStorage.getItem("companyid");
    this.company_status = sessionStorage.getItem("company_status");
  }

  openCompanyProfilePage() {
    this.getCompanyid();
    if (
      this.companyid &&
      this.companyid != undefined &&
      this.companyid != null
    ) {
      this.router.navigate([`/companies/${this.companyid}/company-details`]);
    }
  }

  openBankAccountPage() {
    this.getCompanyid();
    if (
      this.companyid &&
      this.companyid != undefined &&
      this.companyid != null
    ) {
      this.router.navigate([`/companies/${this.companyid}/bankaccount`]);
    }
  }

  openDashboardPage() {
    if (
      this.companyid &&
      this.companyid != undefined &&
      this.companyid != null
    ) {
      this.router.navigate([`/companies/${this.companyid}/dashboard`]);
    }
  }

  openInvoicePage(mode: string) {
    this.seller_flag = sessionStorage.getItem("seller_flag");
    this.getCompanyid();
    if (
      this.companyid &&
      this.companyid != undefined &&
      this.companyid != null
    ) {
      if (this.seller_flag == "true") {
        this.router.navigate([`/companies/${this.companyid}/invoices/sales`]);
      } else {
        this.router.navigate([
          `/companies/${this.companyid}/invoices/purchases`,
        ]);
      }
    }
  }

  openAssociatedCompaniesPage() {
    this.getCompanyid();
    if (
      this.companyid &&
      this.companyid != undefined &&
      this.companyid != null
    ) {
      this.router.navigate([
        `/companies/${this.companyid}/associated-entities`,
      ]);
    }
  }

  openTransactionPage() {
    this.getCompanyid();
    this.seller_flag = sessionStorage.getItem("seller_flag");
    if (
      this.seller_flag == "false" ||
      this.seller_flag == "true" ||
      this.user_role == "HO_user"
    ) {
      this.router.navigate([`/companies/${this.companyid}/transactions`]);
    } else {
      this.snackBar.open("You are not allowed to access this page", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
  }

  openCIHHistoryPage() {
    this.router.navigate([
      `/companies/${this.companyid}/transactions/cih-history`,
    ]);
  }

  openKycPage() {
    this.getCompanyid();
    this.router.navigate([`companies/${this.companyid}/kyc`]);
  }

  openLedgerPage() {
    this.router.navigate([
      `/companies/${this.companyid}/reports/purchaseledger`,
    ]);
  }

  openTransactionalStatement() {
    this.seller_flag = sessionStorage.getItem("seller_flag");
    this.companyid = sessionStorage.getItem("companyid");

    // if (this.seller_flag == "false") {
    this.router.navigate([
      `/companies/${this.companyid}/reports/transactionalstatement`,
    ]);
    // } else {
    //   this.snackBar.open("You are not allowed to access this page", "Close", {
    //     duration: this.durationInSeconds * 3000,
    //     panelClass: ["error-dialog"],
    //   });
    // }
  }

  openTransactionLedger() {
    this.companyid = sessionStorage.getItem("companyid");
    this.router.navigate([
      `/companies/${this.companyid}/reports/transactional-ledger`,
    ]);
  }

  BuyerVirtualAccounts() {
    this.router.navigate([
      `/companies/${this.companyid}/reports/virtual-accounts`,
    ]);
  }

  RecievableAgeingbyInvoices() {
    this.router.navigate([
      `/companies/${this.companyid}/reports/recievable-ageing-by-invoices`,
    ]);
  }

  openUserPage() {
    this.companyid = sessionStorage.getItem("companyid");

    if (this.companyid != undefined && this.companyid != null) {
      this.router.navigate([`/companies/${this.companyid}/users`]);
    }
  }

  openNBFCDashboardPage() {
    this.getNBFCid();
    if (this.nbfc_id != undefined && this.nbfc_id != null) {
      this.router.navigate([`/nbfcs/${this.nbfc_id}/dashboard`]);
    }
  }

  openNBFCInvoicesPage() {
    this.getNBFCid();
    if (this.nbfc_id != undefined && this.nbfc_id != null) {
      this.router.navigate([`/nbfcs/${this.nbfc_id}/invoices`]);
    }
  }
  openNBFCBuyersPage() {
    this.getNBFCid();
    if (this.nbfc_id != undefined && this.nbfc_id != null) {
      this.router.navigate([`/nbfcs/${this.nbfc_id}/buyers`]);
    }
  }

  openNBFCPaymentHistoryPage() {
    // this.getNBFCid();
    // if (this.nbfc_id != undefined && this.nbfc_id != null) {
    //   this.router.navigate([`/nbfcs/${this.nbfc_id}/invoices`]);
    // }
  }

  payoutHistory() {
    this.getNBFCid();
    if (this.nbfc_id != undefined && this.nbfc_id != null) {
      this.router.navigate([`/nbfcs/${this.nbfc_id}/payout_history`]);
    }
  }

  reconcilationHistory() {
    this.getNBFCid();
    if (this.nbfc_id != undefined && this.nbfc_id != null) {
      this.router.navigate([`/nbfcs/${this.nbfc_id}/reconcilation_history`]);
    }
  }

  Disbursement() {
    this.getNBFCid();
    if (this.nbfc_id != undefined && this.nbfc_id != null) {
      this.router.navigate([`/nbfcs/${this.nbfc_id}/disbursment`]);
    }
  }

  Reconcilation() {
    this.getNBFCid();
    if (this.nbfc_id != undefined && this.nbfc_id != null) {
      this.router.navigate([`/nbfcs/${this.nbfc_id}/reconcilation`]);
    }
  }

  PaymentHistory() {
    this.getNBFCid();
    if (this.nbfc_id != undefined && this.nbfc_id != null) {
      this.router.navigate([`/nbfcs/${this.nbfc_id}/payment`]);
    }
  }
}
