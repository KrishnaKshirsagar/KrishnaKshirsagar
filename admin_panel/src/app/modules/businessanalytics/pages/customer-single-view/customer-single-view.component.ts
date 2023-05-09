/** @format */

import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatDialog } from "@angular/material/dialog";
import { NavigationExtras, Router } from "@angular/router";
import { ApiService } from "../../services/api/api.service";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
  shortCurrencyFormat,
} from "src/app/shared/constants/constants";
import { thousandsSeprator } from "src/app/shared/constants/constants";
import { FormControl } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { filter } from "rxjs";
import { Chart } from "highcharts";
import { CanvasJS } from "src/assets/canvasjs-3.7.5/canvasjs.angular.component";

@Component({
  selector: "app-customer-single-view",
  templateUrl: "./customer-single-view.component.html",
  styleUrls: ["./customer-single-view.component.scss"],
})
export class CustomerSingleViewComponent implements AfterViewInit {
  myControl = new FormControl("");

  Currency_Format = CURRENCY_FORMAT;

  Date_Format = DATE_FORMAT;

  month_array = [
    {
      name: "Jan",
      value: 1,
    },
    {
      name: "Feb",
      value: 2,
    },
    {
      name: "Mar",
      value: 3,
    },
    {
      name: "Apr",
      value: 4,
    },
    {
      name: "May",
      value: 5,
    },
    {
      name: "Jun",
      value: 6,
    },
    {
      name: "Jul",
      value: 7,
    },
    {
      name: "Aug",
      value: 8,
    },
    {
      name: "Sep",
      value: 9,
    },
    {
      name: "Oct",
      value: 10,
    },
    {
      name: "Nov",
      value: 11,
    },
    {
      name: "Dec",
      value: 12,
    },
  ];

  year_array = ["2023", "2022", "2021"];

  company_details!: any;

  selected_company_flag: Boolean = false;

  companyId!: string;

  company_list: any = [];

  box1_data: any = {};

  box3_data: any = {};

  box4_filter: any = [];

  box4_data: any = [];

  gst_analyser_data: any = [];

  total_gst_amt: number = 0;

  box12_data: any = [];

  chart: any;

  chartOptions1 = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "",
    },
    axisX: {
      valueFormatString: "D MMM",
    },
    axisY: {
      title: "Number of Sales",
    },
    toolTip: {
      shared: true,
    },
    legend: {
      cursor: "pointer",
      itemclick: function (e: any) {
        if (
          typeof e.dataSeries.visible === "undefined" ||
          e.dataSeries.visible
        ) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        e.chart.render();
      },
    },

    data: [
      {
        type: "line",
        showInLegend: true,
        name: "From MM YYYY ",
        xValueFormatString: "MMM DD, YYYY",
        // dataPoints: this.box4_data?.data1,

        dataPoints: [
          { x: new Date(2021, 8, 1), y: 0 },
          { x: new Date(2021, 8, 2), y: 1 },
          { x: new Date(2021, 8, 3), y: 2 },
          { x: new Date(2021, 8, 4), y: 3 },
          { x: new Date(2021, 8, 5), y: 4 },
        ],
      },
      {
        type: "line",
        showInLegend: true,
        name: "With MM YYYY",
        dataPoints: [
          { x: new Date(2021, 8, 1), y: 10 },
          { x: new Date(2021, 8, 2), y: 11 },
          { x: new Date(2021, 8, 3), y: 12 },
          { x: new Date(2021, 8, 4), y: 13 },
          { x: new Date(2021, 8, 5), y: 14 },
        ],
      },
    ],
  };

  chartOptions2 = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Invoice Paid vs Invoice Generated",
    },
    axisX: {
      valueFormatString: "D MMM",
    },
    axisY: {
      title: "Number of Sales",
    },
    toolTip: {
      shared: true,
    },
    legend: {
      cursor: "pointer",
      itemclick: function (e: any) {
        if (
          typeof e.dataSeries.visible === "undefined" ||
          e.dataSeries.visible
        ) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        e.chart.render();
      },
    },
    data: [
      {
        type: "line",
        showInLegend: true,
        name: "Invoice Paid",
        xValueFormatString: "MMM DD, YYYY",
        dataPoints: [
          { x: new Date(2021, 8, 1), y: 0 },
          { x: new Date(2021, 8, 2), y: 60 },
          { x: new Date(2021, 8, 3), y: 0 },
          { x: new Date(2021, 8, 4), y: 60 },
          { x: new Date(2021, 8, 5), y: 10 },
        ],
      },
      {
        type: "line",
        showInLegend: true,
        name: "Invoice Generated",
        dataPoints: [
          { x: new Date(2021, 8, 1), y: 60 },
          { x: new Date(2021, 8, 2), y: 0 },
          { x: new Date(2021, 8, 3), y: 60 },
          { x: new Date(2021, 8, 4), y: 10 },
          { x: new Date(2021, 8, 5), y: 60 },
        ],
      },
    ],
  };

  chartOptions3 = {
    title: {
      text: "",
    },
    animationEnabled: true,
    axisX: {
      interval: 10,
      intervalType: "day",
      valueFormatString: "D MMM",
      labelFontColor: "rgb(0,75,141)",
      minimum: new Date(2012, 6, 10),
    },
    axisY: {
      title: "",
      interlacedColor: "#EBF2FA",
      tickColor: "azure",
      titleFontColor: "#4f81bc",
      valueFormatString: "#M,,.",
    },
    data: [
      {
        name: "views",
        type: "area",
        markerSize: 8,
        dataPoints: [
          {
            x: new Date(2012, 6, 15),
            y: 1000000,
            indexLabel: "Release",
            indexLabelFontColor: "orangered",
            markerColor: "orangered",
          },
          { x: new Date(2012, 6, 18), y: 2000000 },
          { x: new Date(2012, 6, 23), y: 1500000 },
          { x: new Date(2012, 7, 1), y: 3000000, indexLabel: "10M" },
          { x: new Date(2012, 7, 11), y: 21000000 },
          { x: new Date(2012, 7, 23), y: 50000000 },
          { x: new Date(2012, 7, 31), y: 75000000 },
          { x: new Date(2012, 8, 4), y: 100000000, indexLabel: "100M" },
          { x: new Date(2012, 8, 10), y: 125000000 },
          { x: new Date(2012, 8, 13), y: 150000000 },
          { x: new Date(2012, 8, 16), y: 175000000 },
          { x: new Date(2012, 8, 18), y: 200000000, indexLabel: "200M" },
          { x: new Date(2012, 8, 21), y: 225000000 },
          { x: new Date(2012, 8, 24), y: 250000000 },
          { x: new Date(2012, 8, 26), y: 275000000 },
          { x: new Date(2012, 8, 28), y: 302000000, indexLabel: "300M" },
        ],
      },
    ],
  };

  chartOptions5 = {
    animationEnabled: true,
    exportEnabled: false,
    title: {
      text: "Invoicing Trend",
    },
    axisY: {
      prefix: "k",
    },
    toolTip: {
      shared: true,
      content: "{name}: ${y}",
    },
    legend: {
      fontSize: 13,
    },
    data: [
      {
        type: "splineArea",
        showInLegend: true,
        name: "Chetan Enterprise",
        markerSize: 0,
        color: "rgba(54,158,173,.9)",
        dataPoints: [
          { x: new Date(2020, 0), y: 30 },
          { x: new Date(2020, 1), y: 35 },
          { x: new Date(2020, 2), y: 30 },
          { x: new Date(2020, 3), y: 34 },
          { x: new Date(2020, 4), y: 29 },
          { x: new Date(2020, 5), y: 31 },
          { x: new Date(2020, 6), y: 32 },
          { x: new Date(2020, 7), y: 30 },
          { x: new Date(2020, 8), y: 33 },
          { x: new Date(2020, 9), y: 38 },
          { x: new Date(2020, 10), y: 38 },
          { x: new Date(2020, 11), y: 39 },
        ],
      },
      {
        type: "splineArea",
        showInLegend: true,
        name: "Avg Bills",
        markerSize: 0,
        color: "rgba(134,180,2,.9)",
        dataPoints: [
          { x: new Date(2020, 0), y: 21 },
          { x: new Date(2020, 1), y: 16 },
          { x: new Date(2020, 2), y: 14 },
          { x: new Date(2020, 3), y: 18 },
          { x: new Date(2020, 4), y: 18 },
          { x: new Date(2020, 5), y: 21 },
          { x: new Date(2020, 6), y: 22 },
          { x: new Date(2020, 7), y: 25 },
          { x: new Date(2020, 8), y: 23 },
          { x: new Date(2020, 9), y: 25 },
          { x: new Date(2020, 10), y: 26 },
          { x: new Date(2020, 11), y: 25 },
        ],
      },
    ],
  };

  chartOptions6 = {
    animationEnabled: true,

    title: {
      text: "Overall Spend",
    },
    data: [
      {
        type: "pie",
        startAngle: 45,
        indexLabel: "{name}: {y}",
        indexLabelPlacement: "inside",
        yValueFormatString: "#,###.##'%'",
        dataPoints: [
          { y: 21.3, name: "XRR Pain Company" },
          { y: 27.7, name: "YRR Hardware Company" },
          { y: 17, name: "ZRR Ceramic Company" },
          { y: 14.9, name: "VRR Hardware Company" },
          { y: 8.5, name: "Others" },
        ],
      },
    ],
  };

  chartOptions7 = {
    animationEnabled: true,
    data: [
      {
        type: "column",
        dataPoints: [
          { x: 10, y: 10 },
          { x: 20, y: 20 },
          { x: 30, y: 30 },
          { x: 40, y: 40 },
          { x: 50, y: 55 },
          { x: 60, y: 40 },
          { x: 70, y: 35 },
          { x: 80, y: 25 },
          { x: 90, y: 10 },
        ],
      },
    ],
  };

  chartOptions8 = {
    backgroundColor: "#effafa",
    legend: {
      horizontalAlign: "right",
      verticalAlign: "center",
    },
    data: [
      {
        type: "doughnut",
        showInLegend: true,
        toolTipContent: "<b>{name}</b>: (#percent%)",

        legendText: "{name} (#percent%)",
        indexLabelPlacement: "inside",
        dataPoints: [
          { y: 6566.4, name: "Desktop", color: "#21bfb6" },
          { y: 2599.2, name: "WhatsApp", color: "#6c9693" },
          { y: 1231.2, name: "Mobile", color: "#98d8d4" },
        ],
      },
    ],
  };

  currency_format = CURRENCY_FORMAT;

  b1: any;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private apiservice: ApiService
  ) {}

  openDialog0() {
    const dialogRef = this.dialog.open(PatternsDialog);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialog1() {
    const dialogRef = this.dialog.open(BusinessAnalysisTrendDialog);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialog2() {
    const dialogRef = this.dialog.open(InvoiceGenerationPatternDialog);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialog3() {
    const dialogRef = this.dialog.open(GeographicalAnalysisDialog);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialog4() {
    const dialogRef = this.dialog.open(GstAnalizerDialog);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialog5() {
    const dialogRef = this.dialog.open(CommentsTrailDialog);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialog6() {
    const dialogRef = this.dialog.open(InsightsDialog);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialog7() {
    const dialogRef = this.dialog.open(AverageCreditAmountDialog);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialog8() {
    const dialogRef = this.dialog.open(PreferredPaymentMethodDialog);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  companySuggetion(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length > 2) {
      let companyName = filterValue.toUpperCase();
      this.apiservice
        .companynameAutoSuggestion(companyName)
        .subscribe((res) => {
          this.company_list = [...res.companies];
        });
    }
  }

  displayFn(company: any) {
    const company_name =
      company && company.company_name ? company.company_name : "";
    return company_name;
  }

  getSelectedCompany(comp: any) {
    const companyId = comp._id;
    if (companyId && companyId != undefined) {
      this.selected_company_flag = true;
      this.company_details = comp;
      this.companyId = companyId;
      this.getBox1Data(this.companyId);
      this.getBox3Data(this.companyId);
      this.getGSTAnalyserData(this.companyId);
      this.getBox12Data(this.companyId);
    }
  }

  companyNameClear() {
    this.selected_company_flag = false;
    this.company_list = [];
    this.myControl = new FormControl();
    this.companyId = "";
    this.gst_analyser_data = [];
  }

  gotoKYCpage() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        companyid: JSON.stringify(this.companyId),
      },
    };
    this.router.navigate(
      [`admin/companies/${this.companyId}/kycdetails`],
      navigationExtras
    );
  }

  getBox1Data(companyId: string) {
    this.apiservice.getBox1Data(companyId).subscribe((response: any) => {
      this.box1_data = {};
      if (response?.status == true) {
        this.box1_data = response?.data ?? {};
      }
    });
  }

  getBox3Data(companyId: string) {
    this.apiservice.getBox3Data(companyId).subscribe((response: any) => {
      this.box3_data = {};
      if (response?.status == true) {
        this.box3_data = response?.data ?? {};
        console.log("box3_data : ", this.box3_data);
      }
    });
  }

  // Business Analysis Trend

  BAT_type(value: string) {
    this.box4_filter.type = value;
    if (
      this.box4_filter &&
      this.box4_filter.type &&
      this.box4_filter.from_month &&
      this.box4_filter.from_year &&
      this.box4_filter.with_month &&
      this.box4_filter.with_year
    ) {
      this.getBox4Data(this.companyId);
    }
  }

  BAT_from_month(value: string) {
    this.box4_filter.from_month = value;
    if (
      this.box4_filter &&
      this.box4_filter.type &&
      this.box4_filter.from_month &&
      this.box4_filter.from_year &&
      this.box4_filter.with_month &&
      this.box4_filter.with_year
    ) {
      this.getBox4Data(this.companyId);
    }
  }

  BAT_from_year(value: string) {
    this.box4_filter.from_year = value;
    if (
      this.box4_filter &&
      this.box4_filter.type &&
      this.box4_filter.from_month &&
      this.box4_filter.from_year &&
      this.box4_filter.with_month &&
      this.box4_filter.with_year
    ) {
      this.getBox4Data(this.companyId);
    }
  }

  BAT_with_month(value: string) {
    this.box4_filter.with_month = value;
    if (
      this.box4_filter &&
      this.box4_filter.type &&
      this.box4_filter.from_month &&
      this.box4_filter.from_year &&
      this.box4_filter.with_month &&
      this.box4_filter.with_year
    ) {
      this.getBox4Data(this.companyId);
    }
  }

  BAT_with_year(value: string) {
    this.box4_filter.with_year = value;
    if (
      this.box4_filter &&
      this.box4_filter.type &&
      this.box4_filter.from_month &&
      this.box4_filter.from_year &&
      this.box4_filter.with_month &&
      this.box4_filter.with_year
    ) {
      this.getBox4Data(this.companyId);
    }
  }

  getBox4Data(companyId: string) {
    this.box4_filter.type = "invoice";
    this.box4_filter.from_month = "2";
    this.box4_filter.from_year = "2023";
    this.box4_filter.with_month = "1";
    this.box4_filter.with_year = "2023";

    // this.apiservice
    //   .getBox4Data(companyId, this.box4_filter)
    //   .subscribe((response: any) => {
    //     this.box4_data = [];
    //     if (response?.status == true) {
    //       this.box4_data = [];
    //       for (let i1 = 0; i1 < response?.data1.length; i1++) {
    //         let box4 = {};
    //         (box4 = {
    //           x: new Date(response?.data1[i1]?.date),
    //           y: response?.data1[i1].invoice,
    //         }),
    //           this.box4_data.push(box4);
    //       }
    //     }
    //     console.log("box4_data : ", this.box4_data);
    //   });
    // ===================== chart =============================
    let myChart1 = new CanvasJS.Chart("myChart1", {
      chartOptions1: {
        animationEnabled: true,
        theme: "light2",
        title: {
          text: "",
        },
        axisX: {
          valueFormatString: "D MMM",
        },
        axisY: {
          title: "Number of Sales",
        },
        toolTip: {
          shared: true,
        },
        legend: {
          cursor: "pointer",
          itemclick: function (e: any) {
            if (
              typeof e.dataSeries.visible === "undefined" ||
              e.dataSeries.visible
            ) {
              e.dataSeries.visible = false;
            } else {
              e.dataSeries.visible = true;
            }
            e.chart.render();
          },
        },

        data: [
          {
            type: "line",
            showInLegend: true,
            name:
              this.box4_filter?.from_month + " " + this.box4_filter?.from_year,
            xValueFormatString: "MMM DD, YYYY",
            dataPoints: [
              { x: new Date(2021, 8, 1), y: 10 },
              { x: new Date(2021, 8, 2), y: 11 },
              { x: new Date(2021, 8, 3), y: 21 },
              { x: new Date(2021, 8, 4), y: 31 },
              { x: new Date(2021, 8, 5), y: 41 },
            ],
          },
          {
            type: "line",
            showInLegend: true,
            name:
              this.box4_filter?.with_month + " " + this.box4_filter?.with_year,
            dataPoints: [
              { x: new Date(2021, 8, 1), y: 1 },
              { x: new Date(2021, 8, 2), y: 1 },
              { x: new Date(2021, 8, 3), y: 2 },
              { x: new Date(2021, 8, 4), y: 3 },
              { x: new Date(2021, 8, 5), y: 2 },
            ],
          },
        ],
      },
    });

    myChart1.render();
    this.apiservice
      .getBox4Data(companyId, this.box4_filter)
      .subscribe((response: any) => {
        this.box4_data = [];
        if (response?.status == true) {
          this.box4_data = [];
          for (let i1 = 0; i1 < response?.data1.length; i1++) {
            let box4 = {};
            (box4 = {
              x: new Date(response?.data1[i1]?.date),
              y: response?.data1[i1].invoice,
            }),
              this.box4_data.push(box4);
          }
        }
      });
  }

  //Box 8 (GST Analyser)
  getGSTAnalyserData(companyId: string) {
    this.apiservice.getGSTAnalyserData(companyId).subscribe((resp) => {
      if (resp?.status == true) {
        this.total_gst_amt = 0;
        resp?.data.forEach((element: any) => {
          this.total_gst_amt += Number(element.gst_paid.toFixed(2));
          let gst_analyser = {};
          gst_analyser = {
            y: element.percentage,
            name: element.seller_name,
            amount: element.gst_paid.toFixed(2),
          };
          this.gst_analyser_data.push(gst_analyser);
        });
        this.chartOptions6 = {
          animationEnabled: true,

          title: {
            text: "Overall Spend: " + "₹" + this.total_gst_amt,
          },
          data: [
            {
              type: "pie",
              startAngle: 45,
              indexLabel: `{name}: ₹{amount}`,
              indexLabelPlacement: "inside",
              yValueFormatString: "#,###.##'%'",
              dataPoints: this.gst_analyser_data,
            },
          ],
        };
      }
    });
  }

  getBox12Data(companyId: string) {
    //payment mode
    this.apiservice.getBox12Data(companyId).subscribe((response: any) => {
      this.box12_data = [];
      if (response?.status == true) {
        this.box12_data = response?.data[0];
      }
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  thousandsSepratorNumberFormat(num: any) {
    return thousandsSeprator(num);
  }

  shortCurrencyNumberformat(no: any) {
    return shortCurrencyFormat(no);
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }
}

@Component({
  selector: "patterns-dialog",
  templateUrl: "patterns-dialog.html",
  styleUrls: ["./customer-single-view.component.scss"],
})
export class PatternsDialog implements OnInit {
  constructor() {}

  ngOnInit() {}
}

@Component({
  selector: "business-analysis-trend-dialog",
  templateUrl: "business-analysis-trend-dialog.html",
  styleUrls: ["./customer-single-view.component.scss"],
})
export class BusinessAnalysisTrendDialog implements OnInit {
  constructor() {}

  ngOnInit() {}
}

@Component({
  selector: "invoice-generation-pattern-dialog",
  templateUrl: "invoice-generation-pattern-dialog.html",
  styleUrls: ["./customer-single-view.component.scss"],
})
export class InvoiceGenerationPatternDialog implements OnInit {
  constructor() {}

  ngOnInit() {}
}

@Component({
  selector: "geographical-analysis-dialog",
  templateUrl: "geographical-analysis-dialog.html",
  styleUrls: ["./customer-single-view.component.scss"],
})
export class GeographicalAnalysisDialog implements OnInit {
  constructor() {}

  ngOnInit() {}
}

@Component({
  selector: "gst-analizer-dialog",
  templateUrl: "gst-analizer-dialog.html",
  styleUrls: ["./customer-single-view.component.scss"],
})
export class GstAnalizerDialog implements OnInit {
  constructor() {}

  ngOnInit() {}
}

@Component({
  selector: "comments-trail-dialog",
  templateUrl: "comments-trail-dialog.html",
  styleUrls: ["./customer-single-view.component.scss"],
})
export class CommentsTrailDialog implements OnInit {
  constructor() {}

  ngOnInit() {}
}

@Component({
  selector: "insights-dialog",
  templateUrl: "insights-dialog.html",
  styleUrls: ["./customer-single-view.component.scss"],
})
export class InsightsDialog implements OnInit {
  constructor() {}

  ngOnInit() {}
}

@Component({
  selector: "average-credit-amount-dialog",
  templateUrl: "average-credit-amount-dialog.html",
  styleUrls: ["./customer-single-view.component.scss"],
})
export class AverageCreditAmountDialog implements OnInit {
  constructor() {}

  ngOnInit() {}
}

@Component({
  selector: "preferred-payment-method-dialog",
  templateUrl: "preferred-payment-method-dialog.html",
  styleUrls: ["./customer-single-view.component.scss"],
})
export class PreferredPaymentMethodDialog implements OnInit {
  constructor() {}

  ngOnInit() {}
}
