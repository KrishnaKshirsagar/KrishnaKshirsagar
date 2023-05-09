import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  
  @Input() routes: {
    title: string;
    path: string;
    icon: string;
  }[] = [];

  username: string = "";

  companyName: string = "Switch Company";

  accessFlag!: boolean;

  activeflag!: boolean;

  sideNavState = false;

  linkText = false;

  userRole = sessionStorage.getItem("Role");

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  onSinenavToggle() {
    this.sideNavState = !this.sideNavState;
    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200);
  }

  openBusinessAnalytics(){
    this.router.navigate(["admin/businessanalytics"]);
  }

  openDashboardPage() {
      this.router.navigate(["admin/dashboard"])
  }

  openCompanyPage() {
    this.router.navigate(["admin/companies"]);
  }

  openInvoicePage() {
    this.router.navigate(["admin/invoices"]);
  }

  openOfflinepaymentPage(){
    this.router.navigate(["admin/companies/offlinepayment"]);
  }

  openUsermanagentPage() {
    this.router.navigate(["usermanagement"]);
  }

  openStaffManagementPage() {
    this.router.navigate(["staffmanagement"]);
  }

  openPaymentHistory() {
    this.router.navigate(["admin/payment"]);
  }

  openEmandateHistory() {
    this.router.navigate(["admin/payment/emandateshistory"]);
  }

  openMisreports() {
    this.router.navigate(["admin/reports/misreports"]);
  }

  openReceivablesStatement(){
    this.router.navigate(["admin/reports/receivablesstatement"]);
  }

  openReceivablesAgeing(){
    this.router.navigate(["admin/reports/receivables_ageing"]);
  }  

  openReceivablesAgeingByInvoice(){
    this.router.navigate(["admin/reports/receivables_ageing_by_invoice"]);
  }

  openDisbursementStatement(){
    this.router.navigate(["admin/reports/disbursement_statement"]);
  }

  openCompaniesSummary(){
    this.router.navigate(["admin/reports/companies-summary"]);
  }

  openInvoiceSummary(){
    this.router.navigate(["admin/reports/invoice-summary"]);
  }

  openLedgerReports() {
    this.router.navigate(["admin/reports/ledger"]);
  }

  openTransactionLedger(){
    this.router.navigate(["admin/reports/transaction-ledger"]);
  }

  openTransactionsstatement() {
    this.router.navigate(["admin/reports/transactionsstatement"]);
  }

  openNbfc() {
    this.router.navigate(["admin/nbfc"]);
  }

  openCreditVerification() {
    this.router.navigate(["admin/companies/creditlimitverification"]);
  }

  creditLimitHistory() {
    this.router.navigate(["admin/companies/creditlimithistory"]);
  }

  openCollection() {
    this.router.navigate(["admin/collection"]);
  }


  openAgent() {
    this.router.navigate(["agent"]);
  }
  
  openHome(){
    this.router.navigate(["admin/document-verification"]);
  
  }
  openPending() {
    this.router.navigate(["admin/document-verification/pending"]);
  }

  openApproved(){
    this.router.navigate(["admin/document-verification/approved"]);

  }

  openRejected(){
    this.router.navigate(["admin/document-verification/rejected"]);
  }
}
