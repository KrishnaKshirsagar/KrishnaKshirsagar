import {
  Component,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { ApiService } from "../../services/api/api.service";
import { Chart, registerables } from "chart.js";
import {
  CURRENCY_FORMAT,
  LOCAL_STORAGE_AUTH_DETAILS_KEY,
  thousandsSeprator,
  shortCurrencyFormat,
} from "src/app/shared/constants/constants";
import { Router } from "@angular/router";
import { DateAdapter } from "@angular/material/core";
import { CurrencyPipe } from "@angular/common";
import { CalendarEvent, CalendarView } from "angular-calendar";
import { Subject } from "rxjs";
import { endOfDay, isSameDay, isSameMonth, startOfDay } from "date-fns";
import { MatDialog } from "@angular/material/dialog";

import { BulkpayDialogComponent } from "src/app/modules/payment/pages/components/bulk-pay/bulkpay.component";
Chart.register(...registerables);

@Component({
  selector: "app-usersdashboard",
  templateUrl: "./usersdashboard.component.html",
  styleUrls: ["./usersdashboard.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class UsersdashboardComponent implements OnInit {

  isCardExpanded = false;

  seller_flag = 'false';

  expand() {
    this.isCardExpanded = !this.isCardExpanded;
  }

  dash: string = 'buyer';

  calendar_month: number = 0;

  calendar_year: number = 0;

  totalInvoiceUploaded: number = 0;

  totalInvoiceConfirmed: number = 0;

  totalInvoicePending: number = 0;

  totalInvoicePaid: number = 0;

  totalInvoiceOverdue: number = 0;

  totalPendingAmt: string = '';
  
  totalDiscountAmt : any = '';

  totalDraftInvoice: number = 0;

  companyid!: string;

  userid!: string;

  user_role!: string;

  nbfc_id!: string;

  credit_limit: number = 0;

  credit_available: number = 0;

  credit_utilized: number = 0;

  cash_in_hand!: string;

  xuriti_score!: string;

  upload_percent: number = 0;

  dates: any[] = [];

  cal_dates: any[] = [];

  Currency_Format = CURRENCY_FORMAT;

  // For NBFC
  total_nbfc_invoice: number = 0;

  total_nbfc_pending_payment!: string;

  total_nbfc_pending_receivable_amount!: string;

  constructor(
    private router: Router,
    private apiservice: ApiService,
    private renderer: Renderer2,
    private dateAdapter: DateAdapter<Date>,
    private currency_pipe: CurrencyPipe,
    private matdialog: MatDialog
  ) {}

  ngOnInit(): void {
    // this.dateAdapter.setLocale('es');
    this.dateAdapter.getFirstDayOfWeek = () => {
      return 1;
    };
    // ========================
    const detailsStr = sessionStorage.getItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);
    if (detailsStr) {
      const details = JSON.parse(detailsStr);
      const userDetails = details.user;
      if (userDetails && userDetails._id) {
        this.userid = userDetails._id;
      }
    }

    this.user_role = sessionStorage.getItem("Role");

    if (this.user_role == "nbfcUser") {
      this.nbfc_id = sessionStorage.getItem("nbfc_id");
      this.getTotalNBFCInvoices();
      this.getTotalPendingPayment();
      this.nbfcCalendar();
      // this.getTotalReceivavleAmount();
    } else {
      const cid = sessionStorage.getItem("companyid");
      this.seller_flag = sessionStorage.getItem("seller_flag");

      if (this.seller_flag == "true") {
        this.dash = "seller";
      } else {
        this.dash = "buyer";
      }

      if (cid && cid != undefined && cid != null) {
        this.companyid = cid;
        this.getUploadedInvoices();
        this.getPendingInvoice();
        this.getConfirmedInvoice();
        this.getOverdueInvoice();
        this.getPaidInvoice();
        this.getPendingAmount();
        this.getCompanyDetails();
      }

      if (this.seller_flag == "true") {
        this.dash = "seller";
        this.nbfcCalendar();
      } else {
        this.dash = "buyer";
      }
    }
  }

  gotoInvoicePage() {
    if (this.dash == "seller") {
      this.router.navigate([`/companies/${this.companyid}/invoices/sales`]);
    } else {
      this.router.navigate([
        `/companies/${this.companyid}/invoices/purchases`,
      ]);
    }
  }

  gotoBulkPayPage() {
    if (this.dash == "seller") {
      this.router.navigate([`/companies/${this.companyid}/invoices/sales`]);
    } else {
      this.router.navigate([
        `/companies/${this.companyid}/invoices/purchases`,
      ]);
      
      this.matdialog.open(BulkpayDialogComponent, {
        data: {
          companyid: this.companyid,
        },
      });
    }
  }

  // ============= NBFC Dashboard Start ===================
  getTotalNBFCInvoices() {
    this.apiservice
      .getInvoicesByNBFC_id(this.nbfc_id)
      .subscribe((respon: any) => {
        if (respon && respon.status == true) {
          this.total_nbfc_invoice =
            respon.nbfc_invoices && respon.nbfc_invoices.length > 0
              ? respon.nbfc_invoices.length
              : 0;
        }
      });
  }

  getTotalPendingPayment() {
    this.apiservice
      .getTotalPendingPayment(this.nbfc_id)
      .subscribe((response: any) => {
        if (response && response.status == true) {
          this.total_nbfc_pending_payment = thousandsSeprator(
            response.data && response.data.total_pending_amount
              ? response.data.total_pending_amount
              : 0
          );
          this.total_nbfc_pending_receivable_amount = thousandsSeprator(
            response.data && response.data.total_receivable_amount
              ? response.data.total_receivable_amount
              : 0
          );
        }
      });
  }

  // ============= NBFC Dashboard End =====================
  dateClass = (d: Date) => {
    if (d.getDate() == 1) {
      this.calendar_month = +("0" + (d.getMonth() + 1)).slice(-2);
      this.calendar_year = d.getFullYear();
      this.displayMonth();
    }

    const dateSearch = this.dateToString(d);
    return this.dates.find((f) => f.invoice_date.split("T")[0] == dateSearch)
      ? "example-custom-date-class"
      : "normal";
  };

  displayMonth() {
    this.getCalendarChart();
    setTimeout(() => {
      let elements = document.querySelectorAll(".endDate");
      let x = document.querySelectorAll(".mat-calendar-body-cell");

      x.forEach((y) => {
        const dateSearch = this.dateToString(
          new Date(y.getAttribute("aria-label"))
        );

        const data = this.cal_dates.find((f) => f.invoice_date == dateSearch);
        if (data && data != undefined) {
          y.setAttribute(
            "aria-label",
            thousandsSeprator(
              data && data.outstanding_amount && data.outstanding_amount != null
                ? data.outstanding_amount
                : 0
            )
          );
        } else {
          y.setAttribute("aria-label", "No Dues");
        }
      });
    }, 1000);
  }

  streamOpened(event) {
    setTimeout(() => {
      let buttons = document.querySelectorAll("mat-calendar .mat-icon-button");

      buttons.forEach((btn) =>
        this.renderer.listen(btn, "click", () => {
          setTimeout(() => {
            //debugger
            this.displayMonth();
          });
        })
      );
      this.displayMonth();
    });
  }

  dateToString(date: any) {
    return (
      date.getFullYear() +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getDate()).slice(-2)
    );
  }

  getdonutchart() {
    const myGaugeChart = new Chart("myGaugeChart", {
      type: "doughnut",
      data: {
        // labels: ["Safe", "Risky", "High Risk"],
        datasets: [
          {
            label: "Gauge",
            data: [33.33, 33.33, 33.33],
            backgroundColor: [
              "rgb(255, 0, 0)",
              "rgb(247, 158, 27)",
              "rgb(0, 128, 0)",
            ],

            borderColor: "white",
            borderWidth: 2,
            circumference: 180,
            rotation: 270,
            borderRadius: 5,
          },
        ],
      },
      options: {
        rotation: 270, // start angle in degrees
        circumference: 180, // sweep angle in degrees
        responsive: true,
        aspectRatio: 2,
      },
    });
  }

  getchart() {
    const myChart = new Chart("myChart", {
      type: "doughnut",
      data: {
        labels: ["Credit Available", "Credit Utilized"],
        datasets: [
          {
            label: "My First Dataset",
            data: [this.credit_available, this.credit_utilized],
            backgroundColor: ["rgb(0, 128, 0)", "rgb(255, 0, 0)"],
            hoverOffset: 4,
          },
        ],
      },

      options: {
        scales: {
          y: {
            display: false,
          },
          x: {
            display: false,
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Credit Availability",
          },
          tooltip: {
            enabled: true,
            intersect: false,
            callbacks: {
              footer: (ttItem) => {
                let sum = this.credit_limit;
                let dataArr = ttItem[0].dataset.data;
                let percentage =
                  ((ttItem[0].parsed * 100) / sum).toFixed(2) + "%";
                return `Percentage of credit: ${percentage}`;
              },
            },
          },
        },
        responsive: true,
        aspectRatio: 2,
      },
    });
  }

  getbarchart() {
    this.apiservice
      .getBarchartdata(this.dash, this.companyid)
      .subscribe((respon: any) => {
        if (respon && respon.status == "true") {
          let lab = [];
          let count = [];
          for (let i = 0; i < respon.invoice.length; i++) {
            lab.push(respon.invoice[i]._id);
            count.push(respon.invoice[i].count);
          }

          const mybarChart = new Chart("mybarChart", {
            type: "bar",
            data: {
              labels: lab,
              datasets: [
                {
                  label: "Invoice",
                  data: count,
                  borderSkipped: "middle",
                  backgroundColor: ["rgb(51, 51, 51)"],
                  borderColor: ["rgba(255, 159, 64, 1)"],
                  borderWidth: 1,
                },
              ],
            },

            options: {
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                  },
                },
                x: {
                  beginAtZero: true,
                },
              },

              plugins: {
                title: {
                  display: true,
                  text: "Invoice Count vs Days",
                },
              },

              responsive: true,
              aspectRatio: 2,
            },
          });
        }
      });
  }

  getCalendarChart() {
    if (this.user_role == "nbfcUser") {
      this.apiservice
        .getNBFCCalendarData(
          this.calendar_month,
          this.calendar_year,
          this.nbfc_id
        )
        .subscribe((resp: any) => {
          if (resp && resp.status == true) {
            this.dates = resp.invoice_details ? resp.invoice_details : [];
            this.dates.forEach((date) => {
              date.invoice_date = date.invoice_date.split("T")[0];
              this.cal_dates.push(date);
            });
          }
        });
    } else {
      this.apiservice
        .getCalendarData(
          this.calendar_month,
          this.calendar_year,
          this.companyid,
          this.userid
        )
        .subscribe((resp: any) => {
          if (resp && resp.status == true) {
            this.dates = resp.invoice_details ? resp.invoice_details : [];
            this.dates.forEach((date) => {
              date.invoice_date = date.invoice_date.split("T")[0];
              this.cal_dates.push(date);
            });
          }
        });
    }
  }

  selectDashboard() {
    this.getUploadedInvoices();
    this.getPendingInvoice();
    this.getConfirmedInvoice();
    this.getOverdueInvoice();
    this.getPaidInvoice();
    this.getPendingAmount();
    this.getCompanyDetails();
    if (this.dash == "seller") {
      this.nbfcCalendar();
    }
  }

  getDraftInvoices(gstin: string) {
    this.apiservice
      .getDraftInvoice(this.dash, this.companyid, gstin)
      .subscribe((respo: any) => {
        this.totalDraftInvoice =
          respo && respo.invoice_details ? respo.invoice_details.length : 0;
      });
  }

  getCompanyDetails() {
    this.apiservice
      .checkCompaniesAccess(this.companyid, this.userid)
      .subscribe((respon: any) => {
        if (respon && respon.status == true) {
          const gstin =
            respon.company &&
            respon.company[0].Company &&
            respon.company[0].Company.company &&
            respon.company[0].Company.company.gstin
              ? respon.company[0].Company.company.gstin
              : "";
          this.credit_limit =
            respon.company &&
            respon.company[0].Company &&
            respon.company[0].Company.company &&
            respon.company[0].Company.company.creditLimit
              ? +respon.company[0].Company.company.creditLimit
              : 0;
          this.credit_available =
            respon.company &&
            respon.company[0].Company &&
            respon.company[0].Company.company &&
            respon.company[0].Company.company.avail_credit
              ? +respon.company[0].Company.company.avail_credit
              : 0;
          this.credit_utilized = this.credit_limit - this.credit_available;
          this.cash_in_hand =
            respon.company &&
            respon.company[0].Company &&
            respon.company[0].Company.company &&
            respon.company[0].Company.company.cih &&
            respon.company[0].Company.company.cih.amount
              ? respon.company[0].Company.company.cih.amount
              : 0;
          this.xuriti_score =
            respon.company &&
            respon.company[0].Company &&
            respon.company[0].Company.company &&
            respon.company[0].Company.company.xuriti_score
              ? respon.company[0].Company.company.xuriti_score
              : 0;

          if (gstin && gstin != "" && gstin != null && gstin != undefined) {
            this.getDraftInvoices(gstin);
          }
          if (this.dash == "buyer") {
            this.getchart();
            this.getbarchart();
            this.getdonutchart();
          }
        }
      });
  }

  ngAfterViewInit() { }

  getUploadedInvoices() {
    this.apiservice
      .getUploadedInvoices(this.dash, this.companyid, this.userid)
      .subscribe((resp: any) => {
        this.totalInvoiceUploaded =
          resp && resp.invoice_details ? resp.invoice_details.length : 0;
        this.totalDiscountAmt = resp?.total_discount || 0;
      });
  }

  getPendingInvoice() {
    this.apiservice
      .getPendingInvoice(this.dash, this.companyid, this.userid)
      .subscribe((resp: any) => {
        this.totalInvoicePending =
          resp && resp.invoice_details ? resp.invoice_details.length : 0;
      });
  }

  getConfirmedInvoice() {
    this.apiservice
      .getConfirmedInvoice(this.dash, this.companyid, this.userid)
      .subscribe((resp: any) => {
        this.totalInvoiceConfirmed =
          resp && resp.invoice_details ? resp.invoice_details.length : 0;
      });
  }

  getOverdueInvoice() {
    this.apiservice
      .getOverdueInvoice(this.dash, this.companyid, this.userid)
      .subscribe((resp: any) => {
        this.totalInvoiceOverdue =
          resp && resp.invoice_details ? resp.invoice_details.length : 0;
      });
  }

  getPaidInvoice() {
    this.apiservice
      .getPaidInvoice(this.dash, this.companyid, this.userid)
      .subscribe((resp: any) => {
        this.totalInvoicePaid =
          resp && resp.invoice_details ? resp.invoice_details.length : 0;
      });
  }

  getPendingAmount() {
    this.apiservice
      .getPendingAmount(this.dash, this.companyid, this.userid)
      .subscribe((resp: any) => {
        this.totalPendingAmt = thousandsSeprator(
          resp &&
            resp.invoice_details[0] &&
            resp.invoice_details[0].outstanding_amount
            ? resp.invoice_details[0].outstanding_amount
            : 0
        );
      });
  }

  // angular calendar
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  month!: number;

  year!: number;

  refresh = new Subject<void>();

  events: any[] = [];

  activeDayIsOpen: boolean = false;

  calendarData: any[] = [];

  dayClicked({ date, events }: { date: Date; events: any[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  addEvent(): void {
    this.events = [];
    let title = "";
    this.calendarData.forEach((element) => {
      if (element.seller_name) {
        let val = shortCurrencyFormat(element.outstanding_amount);
        title = `Seller Name : ${element.seller_name} <br/>   Amount to be disbursed : ₹${val}`;
      } else if (element.buyer_name) {
        let val = shortCurrencyFormat(element.outstanding_amount);
        title = `Buyer Name : ${element.buyer_name}  &nbsp; &nbsp;   Amount to be disbursed : ₹${val} `;
      }

      if (element.outstanding_amount > 0) {
        this.events.push({
          title: title,
          amount: (element.outstanding_amount),
          start: startOfDay(new Date(element.payment_date)),
          end: endOfDay(new Date(element.payment_date)),
          draggable: false,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
        });
      }
    });
    this.refresh.next();
  }

  getTotalAmount(events: any[]): number {
    let sum = 0;
    for (let index = 0; index < events.length; index++) {
      sum += +events[index].amount;
    }
    return shortCurrencyFormat(sum);
  }

  closeOpenMonthViewDay() {
    this.nbfcCalendar();
    this.activeDayIsOpen = false;
  }

  nbfcCalendar() {
    this.month = this.viewDate.getMonth() + 1;
    this.year = this.viewDate.getFullYear();
    if (this.user_role == "nbfcUser") {
      this.apiservice
        .getNBFCCalendarData(this.month, this.year, this.nbfc_id)
        .subscribe((resp: any) => {
          if (resp && resp.status == true) {
            this.calendarData = resp.invoice_details;
            if (this.calendarData) {
              this.addEvent();
            }
          }
        });
    } else {
      this.apiservice
        .getCalendarData(this.month, this.year, this.companyid, this.userid)
        .subscribe((resp: any) => {
          if (resp && resp.status == true) {
            this.calendarData = resp.invoice_details;
            if (this.calendarData) {
              this.addEvent();
            }
          }
        });
    }
  }
}

// Dialog box class
@Component({
  selector: "usersdashboard-dialog",
  templateUrl: "usersdashboard-dialog.html",
  styleUrls: ["./usersdashboard.component.scss"],
})
export class UsersdashboardDialog implements OnInit {

  constructor() {}

  ngOnInit() {}
}
