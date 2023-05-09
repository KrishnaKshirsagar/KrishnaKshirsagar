import {
  AfterViewInit,
  Component,
  OnInit,
  VERSION,
  ViewChild,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { ApiService } from "../../services/api/api.service";
import { FormControl, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
} from "src/app/shared/constants/constants";
import { formatDate } from "@angular/common";

interface LedgerNode {
  invoice_number: string,
  date: string;
  doctype: string;
  doc: string;
  parantdoc: string;
  creditor: string;
  debitor: string;
  transactiontitle: string;
  transactiontype: string;
  value: string;
  remarks: string;
  children?: LedgerNode[];
}

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  invoice_number: string,
  date: string;
  doctype: string;
  doc: string;
  parantdoc: string;
  creditor: string;
  debitor: string;
  transactiontitle: string;
  transactiontype: string;
  value: string;
  remarks: string;
  level: number;
}

@Component({
  selector: "app-ledger",
  templateUrl: "./ledger.component.html",
  styleUrls: ["./ledger.component.scss"],
  providers: [],
})

export class LedgerComponent implements AfterViewInit {

  Date_Format = DATE_FORMAT;

  Currency_Format = CURRENCY_FORMAT;

  durationInSeconds = 2;

  companySelect: FormControl = new FormControl();

  selectedCompanyId!: string;

  invoice_number!: string;

  invoiceNumberControl = new FormControl();

  company_Name: any = [];

  maxDate!: Date;

  toDate: any;

  fromDate: any;

  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  date = "Angular " + VERSION.major;

  displayedColumns: string[] = [
    "actn",
    "invoice_number",
    "date",
    "doctype",
    "doc",
    "parantdoc",
    "creditor",
    "debitor",
    "transactiontitle",
    "transactiontype",
    "value",
  ];

  private _transformer = (node: LedgerNode, level: number) => {
    return {
      invoice_number: node.invoice_number,
      expandable: !!node.children && node.children.length > 0,
      date: node.date,
      doctype: node.doctype,
      doc: node.doc,
      parantdoc: node.parantdoc,
      creditor: node.creditor,
      debitor: node.debitor,
      transactiontitle: node.transactiontitle,
      transactiontype: node.transactiontype,
      value: node.value,
      remarks: node.remarks,
      level: level,
    };
  };

  ngOnInit(): void {
    this.getLedgerReport();
    this.maxDate = new Date();
  }

  ngAfterViewInit() {}

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private apiservice: ApiService,
    private snackBar: MatSnackBar
  ) {  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ledger_report: LedgerNode[] = [];

  datefilter() {
    const start = this.dateRange.value.start;
    const end = this.dateRange.value.end;

    this.fromDate = formatDate(start, "yyyy-MM-dd", "en-US");
    this.toDate = formatDate(end, "yyyy-MM-dd", "en-US");
    this.getLedgerReport();
  }

  applyFilterByInvoiceNo(invoiceno: any) {
    const filterValue = (invoiceno.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
    this.invoice_number = filterValue.toLocaleUpperCase();
    if(this.invoice_number && this.invoice_number != undefined && this.invoice_number != null){
      this.getLedgerReport();
    }
  }

  clearInvoiceNumber(){
    this.invoiceNumberControl = new FormControl();
    this.invoice_number = '';
    this.getLedgerReport();
  }

  getLedgerReport() {
     let filterdata: any = [];
     if(this.selectedCompanyId != undefined && this.selectedCompanyId != null && this.selectedCompanyId != ""){
      filterdata['sellerid'] = this.selectedCompanyId
     }
     if(this.fromDate && this.fromDate != undefined && this.fromDate != null
      && this.toDate && this.toDate != undefined && this.toDate != null){
      filterdata["from"] = this.fromDate;
      filterdata["to"] = this.toDate;
     }

     if(this.invoice_number && this.invoice_number != null && this.invoice_number != '' && this.invoice_number != undefined){
      filterdata["invoice_number"] = this.invoice_number
     }

    this.apiservice.getLedgerReport(filterdata).subscribe((response: any) => {
      if(response && response.status == true){
        var arr: any = [];
        response.ledgers.forEach((elements: any) => {
          let data = {};
          let data1 = {};

          data = {
            invoice_number: elements.result[0].Sales_invoice.doc,
          }
          let children2: any[] = [];
          //Sells Invoice data(Invoice upload/confirmed)
          if (elements.result[0].Sales_invoice) {
            //Loop to push the outer loop in children
            let sample: any = {};
                  (sample.actn = ""),
                  (sample.invoiceno = ""),
                  (sample.date = elements.result[0].Sales_invoice.date ? elements.result[0].Sales_invoice.date : ''),
                  (sample.doctype = "Sales Invoice"),
                  (sample.doc = elements.result[0].Sales_invoice.doc ? elements.result[0].Sales_invoice.doc : ''),
                  (sample.parantdoc = elements.result[0].Sales_invoice.parent_doc ? elements.result[0].Sales_invoice.parent_doc : ''),
                  (sample.creditor = elements.result[0].Sales_invoice.creditor ? elements.result[0].Sales_invoice.creditor : ''),
                  (sample.debitor = elements.result[0].Sales_invoice.debitor ? elements.result[0].Sales_invoice.debitor : ''),
                  (sample.transactiontitle = "Net Invoice Value"),
                  (sample.transactiontype = ''),
                  (sample.value = elements.result[0].Sales_invoice.total_invoice_value ? elements.result[0].Sales_invoice.total_invoice_value : 0),
                  (sample.remarks = "");
                children2.push(sample);

            //Loop to push the inner loop in children
            elements.result[0].Sales_invoice.net_invoice_value.forEach(
              (ele: any) => {
                let sample: any = {};
                  (sample.actn = ""),
                  (sample.invoiceno = ""),
                  (sample.date = ""),
                  (sample.doctype = ""),
                  (sample.doc = ""),
                  (sample.parantdoc = ""),
                  (sample.creditor = ""),
                  (sample.debitor = ""),
                  (sample.transactiontitle = ""),
                  (sample.transactiontype = ele.type),
                  (sample.value = ele.amount),
                  (sample.remarks = "");
                children2.push(sample);
              }
            );

            //Loop to push the code in main object
            
          }

            //Buyer Payment (Buyer to NBFC payment)
          if (elements.result[0].buyer_payment && elements.result[0].buyer_payment.length > 0) {
            //Loop to push the code in main object
            let sample1: any = {};
            sample1 = {
              doctype: "Buyer Payment",
              doc:
                elements.result[0].buyer_payment[0] &&
                elements.result[0].buyer_payment[0].doc
                  ? elements.result[0].buyer_payment[0].doc
                  : "",
              parentdoc:
                elements.result[0].buyer_payment[0] &&
                elements.result[0].buyer_payment[0].parent_doc
                  ? elements.result[0].buyer_payment[0].parent_doc
                  : "",
              creditor:
                elements.result[0].buyer_payment[0] &&
                elements.result[0].buyer_payment[0].creditor
                  ? elements.result[0].buyer_payment[0].creditor
                  : "",
              debitor:
                elements.result[0].buyer_payment[0] &&
                elements.result[0].buyer_payment[0].debitor
                  ? elements.result[0].buyer_payment[0].debitor
                  : "",
              transactiontitle: "",
              value: elements.result[0].buyer_payment[0] &&
              elements.result[0].buyer_payment[0].buyer_payment
                ? elements.result[0].buyer_payment[0].buyer_payment
                : "",
              // children: children2,
            };
            children2.push(sample1);

            //Loop to push the code in children
            elements.result[0].buyer_payment.forEach((ele: any) => {
              if (ele.loan) {
                let sample1: any = {};
                 (sample1.actn = ""),
                  (sample1.invoiceno = ""),
                  (sample1.date = ele.date),
                  (sample1.doctype = ""),
                  (sample1.doc = ""),
                  (sample1.parantdoc = ""),
                  (sample1.creditor = ele.creditor),
                  (sample1.debitor = ele.debitor),
                  (sample1.transactiontitle = "Loan Repaid"),
                  (sample1.transactiontype = ele.type),
                  (sample1.value = ele.loan ? ele.loan : 0),
                  (sample1.remarks = "");
                children2.push(sample1);
              }
              // Interest
              if (ele.interest) {
                let sample1: any = {};
                (sample1.date = ""),
                  (sample1.doctype = ""),
                  (sample1.doc = ""),
                  (sample1.parantdoc = ""),
                  (sample1.creditor = ""),
                  (sample1.debitor = ""),
                  (sample1.transactiontitle = ""),
                  (sample1.transactiontype = "Interest"),
                  (sample1.value = ele.interest ? ele.interest : 0),
                  (sample1.remarks = "");
                children2.push(sample1);
              }
              //Overdue Interest
              if (ele.overdue_interest) {
                let sample1: any = {};
                (sample1.date = ""),
                  (sample1.doctype = ""),
                  (sample1.doc = ""),
                  (sample1.parantdoc = ""),
                  (sample1.creditor = ""),
                  (sample1.debitor = ""),
                  (sample1.transactiontitle = ""),
                  (sample1.transactiontype = "Overdue Interest"),
                  (sample1.value = ele.overdue_interest ? ele.overdue_interest : 0),
                  (sample1.remarks = "");
                children2.push(sample1);
              }
            });
          }

          // Supplier Payment (NBFC to Seller)
          if(elements.result[0].supplier_payment && elements.result[0].supplier_payment.length > 0){
            let sample1: any = {};

            sample1 = {
              doctype: "Supplier Payment",
              doc:
                elements.result[0].supplier_payment[0] &&
                elements.result[0].supplier_payment[0].doc
                  ? elements.result[0].supplier_payment[0].doc
                  : "",
              parentdoc:
                elements.result[0].supplier_payment[0] &&
                elements.result[0].supplier_payment[0].parent_doc
                  ? elements.result[0].supplier_payment[0].parent_doc
                  : "",
              creditor:
                elements.result[0].supplier_payment[0] &&
                elements.result[0].supplier_payment[0].creditor
                  ? elements.result[0].supplier_payment[0].creditor
                  : "",
              debitor:
                elements.result[0].supplier_payment[0] &&
                elements.result[0].supplier_payment[0].debitor
                  ? elements.result[0].supplier_payment[0].debitor
                  : "",
              transactiontitle: "",
              // children: children2,
            };
            children2.push(sample1);

            // let children2: any[] = [];
            //Loop to push the code in children
            elements.result[0].supplier_payment.forEach((ele: any) => {
              if (ele && ele.loan) { //loan object
                let sample1: any = {};
                (sample1.date = ele.date),
                  (sample1.doctype = ""),
                  (sample1.doc = ""),
                  (sample1.parantdoc = ""),
                  (sample1.creditor = ""),
                  (sample1.debitor = ""),
                  (sample1.transactiontitle = "Loan Disbursal"),
                  (sample1.transactiontype = "Loan"),
                  (sample1.value = ele.loan ? ele.loan : 0),
                  (sample1.remarks = "");
                children2.push(sample1);
              }
              if (ele && ele.discount) { //discount object
                let sample1: any = {};
                (sample1.date = ""),
                  (sample1.doctype = ""),
                  (sample1.doc = ""),
                  (sample1.parantdoc = ""),
                  (sample1.creditor = ""),
                  (sample1.debitor = ""),
                  (sample1.transactiontitle = ""),
                  (sample1.transactiontype =
                    ele.discount ? "Discount Charges" : ""),
                  (sample1.value =
                    ele.discount > 0 ? ele.discount : 0),
                  (sample1.remarks = "");
                children2.push(sample1);
              }
            });
            //Loop to push the code in main object            
            children2.push(data1);
          }

          data = {
            invoice_number: elements.result[0].Sales_invoice.doc,
            children: children2,
          };
          arr.push(data);
        });           

        this.dataSource.data = arr
        // this.dataSource.paginator = this.paginator;

      }else{
        this.dataSource.data = [];
        this.snackBar.open(response.message, "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      }
    });
  }

  // ========= dropdwon and auto suggetion =======
  companySuggetion(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length > 2) {
      let companyName = filterValue.toUpperCase();
      this.apiservice
        .companynameAutoSuggestion(companyName)
        .subscribe((res) => {
          this.company_Name = [...res.companies];
        });
    }
  }

  displayFn(company: any): string {
    return company && company.company_name ? company.company_name : "";
  }

  getPosts(companyid: any) {
    this.selectedCompanyId = companyid._id;
    if ((this.selectedCompanyId != undefined || this.selectedCompanyId != null || this.selectedCompanyId != "")) {
       this.getLedgerReport();
    }
  }

  company_name_clear(ctrl: FormControl) {
    this.company_Name = [];
    ctrl.setValue("");
    this.selectedCompanyId = "";
    this.getLedgerReport();
  }

  clearDateRangeFilter(){
    this.dateRange.patchValue({
      start: '',
      end: ''
    });
    this.fromDate = null;
    this.toDate = null;
    this.getLedgerReport();
  }
}

@Component({
  selector: "ledger-dialog",
  templateUrl: "ledger-dialog.html",
  styleUrls: ["./ledger.component.scss"],
})
export class LedgerDialog implements OnInit {
  constructor() {}

  ngOnInit() {}
}
