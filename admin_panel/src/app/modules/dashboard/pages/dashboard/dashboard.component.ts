import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { CURRENCY_FORMAT, shortCurrencyFormat } from 'src/app/shared/constants/constants';
import { thousandsSeprator } from 'src/app/shared/constants/constants';

import * as Highcharts from 'highcharts/highcharts.src';
import highcharts3D from 'highcharts/highcharts-3d.src';
// import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';


import { FormControl, FormGroup, } from '@angular/forms';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { MatSnackBar } from '@angular/material/snack-bar';
highcharts3D(Highcharts);
// HighchartsMore(Highcharts);
// HighchartsSolidGauge(Highcharts);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent  {
  nbfcdup: any;
//overall
  overallInvoiceArr: any[] = [];
  overallPaidArr: any[] = [];
  overallDisbursedArr: any[] = [];

  overallInvoiceArrValue: any[] = [];
  overallPaidArrValue: any[] = [];
  overallDisbursedArrValue: any[] = [];

  overallInvoicePaidValue: number = 0;
  overallInvoiceValue: number = 0;
  overallDisbursedValue: number = 0;

  overallInvoiceCount: number = 0;
  overallDisbursedCount: number = 0;
  overallInvoicePaidCount: number = 0;

  overallInvoice: any = 0;
  overallInvoiceDisbursed: any = 0;
  overallInvoicePaid: any = 0;

  overallChartArr:any[]=[];
  overallPaidChartArr:any[]=[];
  overallDisbursedChartArr:any[]=[];

  overall_x_axis: any = [];

  invoiceTotalCount: any = 0;
  invoicePaidCount: any = 0;
  invoicePartPayCount:any = 0;
  invoicePendingCount: any = 0;
  invoiceConfirmedCount: any = 0;
  invoiceRejectedCount: any = 0;

  invoiceTotalValue: any = 0;
  invoicePaidValue: any = 0;
  invoicePartPayValue:any = 0;
  invoicePendingValue: any = 0;
  invoiceConfirmedValue: any = 0;
  invoiceRejectedValue: any = 0;

  invoiceTotal: any = 0;
  invoicePending: any = 0;
  invoiceRejected: any = 0;
  invoiceConfirmed: any = 0;
  invoicePaid: any = 0;
  invoicePartPay:any = 0;
  
//payment
  paymentArr: any = [];
  paymentReceivedArr: any = [];
  paymentDueArr: any = [];

  paymentValueArr: any = [];
  paymentReceivedValueArr: any = [];
  paymentDueValueArr: any = [];

  paymentChartArr:any[]=[];
  paymentDueChartArr:any[]=[];
  paymentReceivedChartArr:any[]=[];

  totalPaymentCount: any = 0;
  duePaymentCount: any = 0;
  receivedPaymentCount: any = 0;

  totalPaymentValue: any = 0;
  duePaymentValue: any = 0;
  receivedPaymentValue: any = 0;

  totalPayment: any = 0;
  duePayment: any = 0;
  receivedPayment: any = 0;

  payment_x_axis:any = [];

  paymentSellerList:any[]=[];
  paymentSellerListTemp:any[]=[];

  payment_nbfc_List:any[]=[];
  payment_nbfc_ListTemp:any[]=[];

  paymentSeller:FormControl = new FormControl();
  payment_nbfc:FormControl= new FormControl();

  paymentTrendsSeller:FormControl= new FormControl();
  paymentTrendsSellerList:any[]=[]
  paymentTrendsSellerListTemp:any[]=[]

  //retailers

  retailersArr: any[] = [];
  holdRetailersArr: any[] = [];
  inactiveRetailersArr: any[] = [];
  inprogressRetailersArr: any[] = [];
  approveddRetailersArr: any[] = []; 

  totalRetailerCount: number = 0;
  holdRetailerCount: number = 0;
  inprogressCount: number = 0;
  inactiveRetailerCount: number = 0;
  approvedCount: number = 0;

  retailers_x_axis: any = [];

  totalRetailers: number = 0;
  holdRetailers: number = 0;
  inactiveRetailers: number = 0;
  inprogressRetailers: number = 0;
  approvedRetailers: number = 0;

  retailerSellerList:any[]=[];
  retailerSellerListTemp:any[]=[];



  overallSellerListTemp: any[] = [];

  overallSeller: FormControl = new FormControl();

  invoiceSellerSelect: FormControl = new FormControl();

  overDueSeller: FormControl = new FormControl();

  overall_nbfc: FormControl = new FormControl();

  overDue_nbfc: FormControl = new FormControl();

  invoiceData: any;

  invoiceList: any;

  paymentData: any;

  retailerData: any;

  retailersData:any;

  nbfc_mapped_data:any;

  nbfc_mapped:any[]=[];

  nbfc_x_axis:any[]=[];

  nbfc_mapped_name:FormControl = new FormControl();

  nbfcDate:FormControl = new FormControl();

  nbfc_mapped_nbfcList:any[]=[]

  nbfc_mapped_nbfcListTemp:any[]=[]

  nbfcCount:number = 0;

  retailers:any = {
    total : [],
    hold : [],
    approved :[],
    inactive:[],
    inprogress:[],
  }

  paymentTrends:any = {
    paid:[],
    partpay:[]
  }
  
  partpayArr:any[]=[]
  paidArr:any[]=[]
  partpayArrValue:any[]=[]
  paidArrValue:any[]=[]

  trendschartPaidArr:any[]=[]
  trendschartPartpayArr:any[]=[]

  trendsPaidCount:number=0
  trendsPaidValue:number=0

  trendsPartpayCount:number=0
  trendsPartpayValue:number=0

  trendsPartpay:number=0
  trendsPaid:number=0

  trends_x_axis:any[]=[]

  paymentTrendsDate : FormControl = new FormControl()

  retailerSeller: FormControl=new FormControl();
  retailerDate:FormControl = new FormControl();
  highcharts = Highcharts;

  invoiceOverDue: any;

  retailerOption: any;

  monthlyInvoiceAnalysis: any;

  paymentChart: any;

  paymentOption: any;

  paymentTrendsChart:any;

  nbfc_mapped_chart:any;

  yearFilter: any;

  paymentDate: FormControl = new FormControl();

  overdue:any = {
    overdue30: [],
    overdue60: [],
    overdue90: [],
    overdue120: []
  };

  payment:any={
    total:[],
    due:[],
    received:[]
  }

  invoiceSellerList: any = [];
  invoiceSellerListTemp: any = [];

  overallinvoiceSellerList: any = [];
  overallinvoiceSellerListTemp: any = [];

  overallinvoice_nbfc_List: any = [];
  overallinvoice_nbfc_ListTemp: any = [];

  invoice_nbfc_List: any = [];
  invoice_nbfc_ListTemp: any = [];

  overdue_seller_list: any = [];
  overdue_seller_listTemp: any = [];

  overdue_nbfc_list: any = [];
  overdue_nbfc_listTemp: any = [];

 

  overDue_0_count: any = 0;
  overDue_30_count: any = 0;
  overDue_60_count: any = 0;
  overDue_90_count: any = 0;

  overDue_0_value: any = 0;
  overDue_30_value: any = 0;
  overDue_60_value: any = 0;
  overDue_90_value: any = 0;

  overDue_0: any = 0;
  overDue_30: any = 0;
  overDue_60: any = 0;
  overDue_90: any = 0;

  overallInvoices: any = {
    total: [],
    paid: [],
    disbursed: []
  }


 

  overallType: any = 'invoiceAmount';

  

  paymentDataList: any = [];

  



  invoiceDate: any;

  overallDate: FormControl = new FormControl();


  invoiceOption: any;

  invoiceFilterDate: any;

  invoiceType: any = 'invoiceAmount';

  overDueType: any = 'overdueAmount';

  paymentType: string = 'paymentAmount';

  paymentTrendsType: string = 'paymentAmount';

  sum: any = 0;

  invoicedateRange: FormGroup = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  invoicemaxDate: any;

  sellerSelect: FormControl = new FormControl();

  nbfcSelect: FormControl = new FormControl();

  seller_Name: any = [];

  company_Name: any;

  tempInvoice:any;
  tempOverall:any;
  tempOverdue:any;
  tempPayment:any;
  tempPaymentTrends:any;
  tempRetailers:any;
  temp_nbfc_mapped:any;

  invoiceChartFlag: boolean = false;
  numberformat(no: any) {
    return thousandsSeprator(no);
  }

  constructor(
    private snackbar: MatSnackBar,
    private apiService: ApiService
  ) { }
  date_times: any;
  ngOnInit() {
    this.getInvoiceData();
    this.getRetailerFilter();
    this.getPaymentData();
    this.getRetailerData();
    this.get_nbfc_mapped_Data();
  }


  company_name_clear(type?: string) {

    if (type === 'clear invoice seller') {
      this.invoiceSellerSelect = new FormControl();
      this.invoiceSellerListTemp = []
      this.optionSelected({ filterType: 'invoice pie' })
    }

    if (type === 'clear invoice nbfc') {
      this.nbfcSelect = new FormControl();
      this.invoice_nbfc_ListTemp = []
      this.optionSelected({ filterType: 'invoice pie' })
    }

    if (type === 'overdue seller clear') {
      this.overDueSeller = new FormControl()
      this.invoiceSellerListTemp = []
      this.optionSelected({ filterType: 'overdue seller column' })
    }

    if (type === 'overdue nbfc clear') {
      this.overDue_nbfc = new FormControl()
      this.overdue_nbfc_listTemp = []
      this.optionSelected({ filterType: 'overdue seller column' })
    }

    if (type === 'clear overall seller') {
      this.overallSeller = new FormControl();
      this.overallinvoiceSellerListTemp = []
      this.modifyOverallInvoiceData1(this.invoiceList)
    }

    if (type === 'clear overall nbfc') {
      this.overall_nbfc = new FormControl();
      this.overallinvoice_nbfc_ListTemp = []
      this.modifyOverallInvoiceData1(this.invoiceList)
    }

    if (type === 'clear payment seller') {
      this.paymentSeller = new FormControl();
      this.paymentSellerListTemp = []
      this.modifyPaymentData1(this.paymentData);
    }

    if (type === 'clear payment trends seller') {
      this.paymentTrendsSeller = new FormControl();
      this.paymentTrendsSellerListTemp = []
      this.modifyPaymentTrends(this.paymentData);
    }

    if (type === 'clear retailer seller') {
      this.retailerSeller = new FormControl();
      this.retailerSellerListTemp = []
      this.modifyRetailersData1(this.retailersData);
    }

    if (type === 'clear nbfc mapped nbfcs') {
      this.nbfc_mapped_name = new FormControl();
      this.nbfc_mapped_nbfcListTemp = []
      this.modify_nbfc_data1(this.nbfc_mapped_data);
    }

  }
 
  displayFn(lis: any) {
    return lis
  }



  displayBuyerFn(lis: any) {
    return lis
  }


  getInvoiceData() {

    this.apiService.getInvoicesData().subscribe((res: any) => {
      this.invoiceList = res.invoicelist;
      this.overallDate.setValue('6');
      this.modifyOverallInvoiceData1(this.invoiceList);
      this.modifyInvoiceData1(this.invoiceList);
  
      for (let invoice of this.invoiceList) {
        if(invoice.invoice_type == 'IN'){
        if (invoice.invoice_date) {
          if (invoice.invoice_sattus == 'Confirmed' || invoice.invoice_sattus == 'Partpay') {
            let temp_due_date = moment(invoice.invoice_due_date).format('YYYY-MM-DD');
            let curr_date = moment(new Date()).format('YYYY-MM-DD');
            let curr_date_30 = moment(new Date()).subtract(31, 'days').format('YYYY-MM-DD');
            let curr_date_60 = moment(new Date()).subtract(61, 'days').format('YYYY-MM-DD');
            let curr_date_90 = moment(new Date()).subtract(91, 'days').format('YYYY-MM-DD');
            let curr_date_120 = moment(new Date()).subtract(121, 'days').format('YYYY-MM-DD');
            if (temp_due_date <= curr_date && temp_due_date > curr_date_30) {
              this.overdue.overdue30.push(invoice)
            }
            
            if (temp_due_date <= curr_date_30 && temp_due_date > curr_date_60) {
              this.overdue.overdue60.push(invoice)
            }
            if (temp_due_date <=curr_date_60 && temp_due_date > curr_date_90) {
              this.overdue.overdue90.push(invoice)
            }
            if (temp_due_date <= curr_date_90 && temp_due_date > curr_date_120) {
              this.overdue.overdue120.push(invoice)
            }
          }
  
        }
      }
      }

      this.modifyInvoiceOverdueData1(this.overdue);
    })
  }

  modifyOverallInvoiceData1(invoiceList: any) {
    this.overallInvoices = {
      total: [],
      paid: [],
      disbursed: []
    }

    for (let invoice of invoiceList) {
      if (invoice) {
        this.overallInvoices.total.push(invoice);
      }
      if (invoice.nbfc_flag === true) {
        this.overallInvoices.disbursed.push(invoice);
      }
      if (invoice.invoice_sattus == 'Paid' || invoice.invoice_sattus == 'Partpay') {
        this.overallInvoices.paid.push(invoice);
      }
    }
    this.optionSelected({ filterType: 'overall invoice' })
  }

  modifyInvoiceData1(invoiceList: any) {
  
    for (let invoice of invoiceList) {
      if(invoice.invoice_type == 'IN'){
      this.invoiceTotalCount++
      if (invoice.total_invoice_amount) {
        this.invoiceTotalValue += parseFloat(invoice.total_invoice_amount);
      }
      if (invoice.invoice_sattus == 'Rejected') {
        this.invoiceRejectedCount++;
        if (invoice.total_invoice_amount) {
          this.invoiceRejectedValue += parseFloat(invoice.total_invoice_amount);
        }

      }
      if (invoice.invoice_sattus == 'Pending') {
        this.invoicePendingCount++;
        if (invoice.total_invoice_amount) {
          this.invoicePendingValue += parseFloat(invoice.total_invoice_amount);
        }
      }

      if (invoice.invoice_sattus == 'Confirmed') {
        this.invoiceConfirmedCount++;
        if (invoice.total_invoice_amount) {
          this.invoiceConfirmedValue += parseFloat(invoice.total_invoice_amount);

        }
      }
      if (invoice.invoice_sattus == 'Paid' ) {
        this.invoicePaidCount++;
        if (invoice.total_invoice_amount) {
          this.invoicePaidValue += parseFloat(invoice.total_invoice_amount);
        }
      }
      if ( invoice.invoice_sattus == 'Partpay' ) {
        this.invoicePartPayCount++;
        if (invoice.total_invoice_amount) {
          this.invoicePartPayValue += parseFloat(invoice.total_invoice_amount);
        }
      }
    }

    }
  
    this.invoiceTotal = this.invoiceTotalCount;
    this.invoicePaid = this.invoicePaidCount;
    this.invoiceRejected = this.invoiceRejectedCount;
    this.invoiceConfirmed = this.invoiceConfirmedCount;
    this.invoicePending = this.invoicePendingCount;
    this.invoicePartPay = this.invoicePartPayCount
    this.getInvoiceChart();
  }

  modifyInvoiceOverdueData1(overdue: any) {
    this.overDue_0_count=0
    this.overDue_0_value=0
    this.overDue_30_count=0
    this.overDue_30_value=0
    this.overDue_60_count=0
    this.overDue_60_value=0
    this.overDue_90_count=0
    this.overDue_90_value=0
    for (let over30 of overdue.overdue30) {
      this.overDue_0_count++;
      if (over30.outstanding_amount ) {
        this.overDue_0_value += parseFloat(over30.outstanding_amount);
      }
    }

    for (let over60 of overdue.overdue60) {
      this.overDue_30_count++;
      if (over60.outstanding_amount) {
        this.overDue_30_value += parseFloat(over60.outstanding_amount);
      }
    }

    for (let over90 of overdue.overdue90) {
      this.overDue_60_count++;
      if (over90.outstanding_amount) {
        this.overDue_60_value += parseFloat(over90.outstanding_amount);
      }
    }

    for (let over120 of overdue.overdue120) {
      this.overDue_90_count++;
      if (over120.outstanding_amount) {
        this.overDue_90_value += parseFloat(over120.outstanding_amount);
      }
    }

    this.overDue_0 = this.overDue_0_count
    this.overDue_30 = this.overDue_30_count
    this.overDue_60 = this.overDue_60_count
    this.overDue_90 = this.overDue_90_count
    this.invoiceOverDueCharts();
  }

  getPaymentData() {
    this.apiService.getPaymentData().subscribe((res: any) => {
      this.paymentDate.setValue('6')
      
      this.paymentData = res.payment_details;
      this.modifyPaymentData1(this.paymentData);
      this.paymentTrendsDate.setValue('6')
      this.modifyPaymentTrends(this.paymentData);
    })
  }

  modifyPaymentData1(payment:any){
  this.payment={
    total:[],
    due:[],
    received:[]
  }
   for(let data of payment){
    if(data?.order_id){
      this.payment['total'].push(data)
    }
    if(data.invoice_status == 'Partpay' || data.invoice_status == 'Pending' || data.invoice_status == 'Confirmed'){
      this.payment['due'].push(data)
    }
    if(data.order_status == 'Paid'){
      this.payment['received'].push(data)
    }
   }
   
   this.optionSelected({ filterType: 'payment' })
    
  }
  modifyPaymentTrends(payment:any){
    this.paymentTrends={
      paid:[],
      partpay:[]
    }
    for(let list of payment){
      if(list?.invoice_status == 'Paid'){
      this.paymentTrends.paid.push(list)
    }
    if(list?.invoice_status == 'Partpay'){
      this.paymentTrends.partpay.push(list)
    }
    }
    this.optionSelected({filterType:'payment trends'})
    
  }
  getRetailerData() {
    this.apiService.getRetailerData().subscribe((res: any) => {
      this.retailersData = res.company_details;
      this.retailerDate.setValue('6')
      this.modifyRetailersData1(this.retailersData);
      
      // this.getRetailerFilter();
    })
  }

  modifyRetailersData1(retailersData:any){
    this.retailers = {
      total : [],
      hold : [],
      approved :[],
      inactive:[],
      inprogress:[],
    }

    this.retailers["total"].push(retailersData)

    for (let data of retailersData) {
      this.retailers["total"].push(data)
      if (data?.status == 'Hold') {
        this.retailers["hold"].push(data)
      }
      if (data?.status == 'Approved') {
        this.retailers["approved"].push(data)
      }

      if (data?.status == 'Inactive') {
        this.retailers["inactive"].push(data)
      }

      if (data?.status == 'In-Progress') {
        this.retailers["inprogress"].push(data)
      }
    }
    this.optionSelected({filterType:'retailers'})
  }

  get_nbfc_mapped_Data(){
    this.apiService.get_nbfc_mapped_Data().subscribe((res:any)=>{
      
      this.nbfc_mapped_data = res.nbfc_data;
      this.nbfcDate.setValue('6');
    this.modify_nbfc_data1(this.nbfc_mapped_data)
    })
  }

  modify_nbfc_data1(nbfc_mapped_data:any){
    this.optionSelected({filterType:'nbfc map'});
  }
  download(chart_type?: String) {
    if (chart_type == 'payment') {

      this.apiService.exportAsExcelFile(this.payment, 'payment');

    } else if (chart_type == 'overdue') {

      this.apiService.exportAsExcelFile(this.tempOverdue, 'overdue');

    } else if (chart_type == 'invoice') {

      this.apiService.exportAsExcelFile(this.tempInvoice, 'invoice');

    } else if (chart_type == 'overall') {

      this.apiService.exportAsExcelFile(this.overallInvoices, 'overall');

    } else if (chart_type == 'retailer') {

      this.apiService.exportAsExcelFile(this.retailers, 'retailer');
      console.log(this.retailers,"<><><><>")

    } else if (chart_type == 'nbfc map') {

      this.apiService.exportAsExcelFile(this.temp_nbfc_mapped, 'nbfc map');

    }

  }

  shortCurrencyNumberformat(no: any) {
    return shortCurrencyFormat(no);
  }

  invoiceCancelMatSelect() {
    this.invoiceType = "";
  }
  chartsFilter() {

  }
  public InvoiceSellerSuggestion(event: any) {

  }
  async filterData(data?: any) {
    let chart = data.chart ? data.chart : undefined;
    let seller = data.seller ? data.seller : undefined;
    let nbfc = data.nbfc ? data.nbfc : undefined
    let start_date: any = undefined;
    let end_date: any = undefined;


    if (chart == 'overall invoice') {
      if (seller) {
        for (let i = 0; i < this.invoiceList.length; i++) {
          if (this.invoiceList[i].seller_company) {
            if (!this.overallinvoiceSellerList.includes(this.invoiceList[i]?.seller_company)) {
              this.overallinvoiceSellerList.push(this.invoiceList[i]?.seller_company)
            }
          }
        }

        const filterValue = (seller.target as HTMLInputElement).value;
        if (filterValue.length > 2) {
          let companyName = filterValue
            .toUpperCase();
          this.overallinvoiceSellerListTemp = []
          for (let cn of this.overallinvoiceSellerList)
            if (cn.toUpperCase().includes(companyName)) {
              this.overallinvoiceSellerListTemp.push(cn)
            }
        }
      }

      if (nbfc) {
        for (let i = 0; i < this.invoiceList.length; i++) {
          if (this.invoiceList[i].nbfc_name) {
            if (!this.overallinvoice_nbfc_List.includes(this.invoiceList[i]?.nbfc_name)) {
              this.overallinvoice_nbfc_List.push(this.invoiceList[i]?.nbfc_name)
            }
          }
        }
        const filterValue = (nbfc.target as HTMLInputElement).value;
        if (filterValue.length > 2) {
          let companyName = filterValue
            .toUpperCase();
          this.overallinvoice_nbfc_ListTemp = []
          for (let cn of this.overallinvoice_nbfc_List)
            if (cn.toUpperCase().includes(companyName)) {
              this.overallinvoice_nbfc_ListTemp.push(cn)
            }
        }
      }
    }

    if (chart == 'invoice') {
      if (seller) {

        for (let i = 0; i < this.invoiceList.length; i++) {
          if (this.invoiceList[i].seller_company) {
            if (!this.invoiceSellerList.includes(this.invoiceList[i]?.seller_company)) {
              this.invoiceSellerList.push(this.invoiceList[i]?.seller_company)
            }
          }
        }
        const filterValue = (seller.target as HTMLInputElement).value;
        if (filterValue.length > 2) {
          let companyName = filterValue
            .toUpperCase();
          this.invoiceSellerListTemp = []
          for (let cn of this.invoiceSellerList)
            if (cn.toUpperCase().includes(companyName)) {
              this.invoiceSellerListTemp.push(cn)
            }
        }
      }
      if (nbfc) {
        for (let i = 0; i < this.invoiceList.length; i++) {
          if (this.invoiceList[i].nbfc_name) {
            if (!this.invoice_nbfc_List.includes(this.invoiceList[i].nbfc_name)) {
              this.invoice_nbfc_List.push(this.invoiceList[i].nbfc_name)
            }
          }
        }
        const filterValue = (nbfc.target as HTMLInputElement).value;
        if (filterValue.length > 2) {
          let nbfcName = filterValue
            .toUpperCase();
          this.invoice_nbfc_ListTemp = []
          for (let cn of this.invoice_nbfc_List)
            if (cn.toUpperCase().includes(nbfcName)) {
              this.invoice_nbfc_ListTemp.push(cn)
            }
        }
      }
      if (this.invoiceDate) {
        if (this.invoiceDate === 'dateRange') {
          if (this.invoicedateRange.value.start && this.invoicedateRange.value.end) {
            start_date = moment(this.invoicedateRange.value.start).format('YYYY-MM-DD');
            end_date = moment(this.invoicedateRange.value.end).format('YYYY-MM-DD');
          }

        } else if (this.invoiceDate && this.invoiceDate != 'dateRange') {
          start_date = moment().subtract(data.invoiceDate, 'd').format('YYYY-MM-DD');
          end_date = moment(new Date()).format('YYYY-MM-DD')
        }
        this.optionSelected({ filterType: 'invoice pie', start_date: start_date, end_date: end_date })
      }
    }
    if (chart == 'overdue') {
      if (seller) {
        for (let list of this.invoiceList) {
            if (list.seller_company) {
              if (!this.overdue_seller_list.includes(list.seller_company)) {
                this.overdue_seller_list.push(list.seller_company)
              }
            

          }
        }
        const filterValue = (seller.target as HTMLInputElement).value;
        if (filterValue.length > 2) {
          let companyName = filterValue
            .toUpperCase();
          this.invoiceSellerListTemp = []
          for (let cn of this.overdue_seller_list)
            if (cn.toUpperCase().includes(companyName)) {
              this.invoiceSellerListTemp.push(cn)
            }
        }
      }
      if (nbfc) {
        for (let list of this.invoiceList) {
          if (list.nbfc_name) {
            if (!this.overdue_nbfc_list.includes(list.nbfc_name)) {
              this.overdue_nbfc_list.push(list.nbfc_name)
            }
          

        }
      }
      const filterValue = (nbfc.target as HTMLInputElement).value;
      if (filterValue.length > 2) {
        let companyName = filterValue
          .toUpperCase();
        this.overdue_nbfc_listTemp = []
        for (let cn of this.overdue_nbfc_list)
          if (cn.toUpperCase().includes(companyName)) {
            this.overdue_nbfc_listTemp.push(cn)
          }
      }
      }
    }

    if(chart == 'payment'){
      if (seller) {
        for (let i = 0; i < this.paymentData.length; i++) {
          if (this.paymentData[i].seller_name) {
            if (!this.paymentSellerList.includes(this.paymentData[i]?.seller_name)) {
              this.paymentSellerList.push(this.paymentData[i]?.seller_name)
            }
          }
        }

        const filterValue = (seller.target as HTMLInputElement).value;
        if (filterValue.length > 2) {
          
          let companyName = filterValue
            .toUpperCase();
          this.paymentSellerListTemp = []
          for (let cn of this.paymentSellerList)
            if (cn.toUpperCase().includes(companyName)) {
              this.paymentSellerListTemp.push(cn)
            }
        }
      }
      if (nbfc) {
        for (let i = 0; i < this.paymentData.length; i++) {
          if (this.paymentData[i].seller_name) {
            if (!this.paymentSellerList.includes(this.paymentData[i]?.seller_name)) {
              this.paymentSellerList.push(this.paymentData[i]?.seller_name)
            }
          }
        }

        const filterValue = (seller.target as HTMLInputElement).value;
        if (filterValue.length > 2) {
          
          let companyName = filterValue
            .toUpperCase();
          this.paymentSellerListTemp = []
          for (let cn of this.paymentSellerList)
            if (cn.toUpperCase().includes(companyName)) {
              this.paymentSellerListTemp.push(cn)
            }
        }
      }
    }

    if(chart == 'payment trends'){
      if (seller) {
        for (let i = 0; i < this.paymentData.length; i++) {
          if (this.paymentData[i].seller_name) {
            if (!this.paymentTrendsSellerList.includes(this.paymentData[i]?.seller_name)) {
              this.paymentTrendsSellerList.push(this.paymentData[i]?.seller_name)
            }
          }
        }

        const filterValue = (seller.target as HTMLInputElement).value;
        if (filterValue.length > 2) {
          
          let companyName = filterValue
            .toUpperCase();
          this.paymentTrendsSellerListTemp = []
          for (let cn of this.paymentTrendsSellerList)
            if (cn.toUpperCase().includes(companyName)) {
              this.paymentTrendsSellerListTemp.push(cn)
            }
        }
      }
      
    }

    if(chart == 'retailers'){
      if(seller){
        for (let i = 0; i < this.retailersData.length; i++) {
          if (this.retailersData[i].company_name) {
            if (!this.retailerSellerList.includes(this.retailersData[i]?.company_name)) {
              this.retailerSellerList.push(this.retailersData[i]?.company_name)
            }
          }
        }
        const filterValue = (seller.target as HTMLInputElement).value;
        if (filterValue.length > 2) {
          let companyName = filterValue
            .toUpperCase();
          this.retailerSellerListTemp = []
          for (let cn of this.retailerSellerList)
            if (cn.toUpperCase().includes(companyName)) {
              this.retailerSellerListTemp.push(cn)
            }
        }
      }
    }

    if(chart == 'nbfc map'){
      if(nbfc){
        for (let i = 0; i < this.nbfc_mapped_data.length; i++) {
          if (this.nbfc_mapped_data[i].nbfc_name) {
            if (!this.nbfc_mapped_nbfcList.includes(this.nbfc_mapped_data[i].nbfc_name)) {
              this.nbfc_mapped_nbfcList.push(this.nbfc_mapped_data[i].nbfc_name)
            }
          }
        }
        const filterValue = (nbfc.target as HTMLInputElement).value;
        if (filterValue.length > 2) {
          let companyName = filterValue
            .toUpperCase();
          this.nbfc_mapped_nbfcListTemp = []
          for (let cn of this.nbfc_mapped_nbfcList)
            if (cn.toUpperCase().includes(companyName)) {
              this.nbfc_mapped_nbfcListTemp.push(cn)
            }
        }
      }
    }
  }
  async getSellerId(invoiceSeller: any) {
  }

  async getNbfcId(invoiceNbfc: any) {
  }

  optionSelected(data: any) {

    let optionSelectedValue = data.optionSelectedValue ? data.optionSelectedValue : undefined;
    let filterType = data.filterType ? data.filterType : undefined;
    let start_date = data.start_date ? data.start_date : undefined;
    let end_date = data.end_date ? data.end_date : undefined;

    if (filterType == 'overall invoice') {
      this.overallPaidArr = [];
      this.overallInvoiceArr = [];
      this.overallDisbursedArr = [];
      this.overallInvoiceArrValue = [];
      this.overallPaidArrValue = [];
      this.overallDisbursedArrValue = [];
      this.overallInvoiceCount = 0;
      this.overallDisbursedCount = 0;
      this.overallInvoicePaidCount = 0;
      this.overallInvoiceValue = 0;
      this.overallDisbursedValue = 0;
      this.overallInvoicePaidValue = 0

      if (this.overallSeller.value) {
        this.overallInvoices.total = this.overallInvoices.total.filter((e: any) => {
          if (e.seller_company === this.overallSeller.value) {
            return e
          }
        })
        this.overallInvoices.paid = this.overallInvoices.paid.filter((e: any) => {
          if (e.seller_company == this.overallSeller.value) {
            return e
          }
        })
        this.overallInvoices.disbursed = this.overallInvoices.disbursed.filter((e: any) => {
          if (e.seller_company == this.overallSeller.value) {
            return e
          }
        })
      }

      if (this.overall_nbfc.value) {
        this.overallInvoices.total = this.overallInvoices.total.filter((e: any) => {
          if (e.nbfc_name === this.overall_nbfc.value) {
            return e
          }
        })

        this.overallInvoices.paid = this.overallInvoices.paid.filter((e: any) => {
          if (e.nbfc_name == this.overall_nbfc.value) {
            return e
          }
        })

        this.overallInvoices.disbursed = this.overallInvoices.disbursed.filter((e: any) => {
          if (e.nbfc_name == this.overall_nbfc.value) {
            return e
          }
        })
      }

      if (this.overallDate.value) {
        let start1: any = parseInt(moment(new Date()).subtract(this.overallDate.value, 'month').locale('en').format('MM'));
        let end1: any = parseInt(moment(new Date()).locale('en').format('MM'))
        let i: any = start1;
        this.overall_x_axis = []
        do {
          i++;
          if (i > 12) {
            i = 1
          }
          this.overall_x_axis.push(moment(i, 'MM').locale('en').format('MMM'))
        } while (i != end1);

        for (let i = 0; i < this.overallDate.value; i++) {
          this.overallInvoiceArr[i] = 0;
          this.overallPaidArr[i] = 0;
          this.overallDisbursedArr[i] = 0;
          this.overallInvoiceArrValue[i] = 0;
          this.overallPaidArrValue[i] = 0;
          this.overallDisbursedArrValue[i] = 0;
        }
        for (let i = 0; i < this.overall_x_axis.length; i++) {
          for (let j = 0; j < this.overallInvoices.total.length; j++) {
            if (moment(this.overallInvoices.total[j]?.invoice_date?.split('T')[0]).locale('en').format('MMM') == this.overall_x_axis[i]) {
              this.overallInvoiceArr[i] += 1;
              if (this.overallInvoices.total[j].outstanding_amount) {
                this.overallInvoiceArrValue[i] += parseInt(this.overallInvoices.total[j].outstanding_amount)
              }
            }
          }
          for (let j = 0; j < this.overallInvoices.paid.length; j++) {
            if (moment(this.overallInvoices.paid[j]?.invoice_date?.split('T')[0]).locale('en').format('MMM') == this.overall_x_axis[i]) {
              this.overallPaidArr[i] += 1;
              if (this.overallInvoices.paid[j].already_paid_amount) {
                this.overallPaidArrValue[i] += parseInt(this.overallInvoices.paid[j].already_paid_amount)
              }
            }
          }
          for (let j = 0; j < this.overallInvoices.disbursed.length; j++) {
            if (moment(this.overallInvoices.disbursed[j]?.invoice_date?.split('T')[0]).locale('en').format('MMM') == this.overall_x_axis[i]) {
              this.overallDisbursedArr[i] += 1
              if (this.overallInvoices.disbursed[j].disbursed_amount.length > 0) {
                this.overallDisbursedArrValue[i] += parseInt(this.overallInvoices.disbursed[j].disbursed_amount)
              }
            }
          }
        }

        for (let list of this.overallInvoiceArrValue) {
          this.overallInvoiceValue += list
        }

        for (let list of this.overallPaidArrValue) {
          this.overallInvoicePaidValue += list
        }

        for (let list of this.overallDisbursedArrValue) {
          this.overallDisbursedValue += list
        }



        for (let list of this.overallInvoiceArr) {
          this.overallInvoiceCount += list
        }

        for (let list of this.overallPaidArr) {
          this.overallInvoicePaidCount += list
        }

        for (let list of this.overallDisbursedArr) {
          this.overallDisbursedCount += list
        }
        this.overallInvoice = this.overallInvoiceCount
        this.overallInvoicePaid = this.overallInvoicePaidCount
        this.overallInvoiceDisbursed = this.overallDisbursedCount
        // for(let i = 0; i < this.overallInvoiceArr.length; i++){
        //   this.overallChartArr[i]=this.overallInvoiceArr[i]
        // }

        // for(let i = 0; i < this.overallDisbursedArr.length; i++){
        //   this.overallPaidChartArr[i]=this.overallDisbursedArr[i]
        // }

        // for(let i = 0; i < this.overallPaidArr.length; i++){
        //   this.overallDisbursedChartArr[i]=this.overallPaidArr[i]
        // }

        this.overallTypeFilter();
      }
    }

    if (filterType == 'invoice pie') {
      let invoiceData = this.invoiceList;
      if (this.invoiceSellerSelect.value) {


        invoiceData = invoiceData.filter((e: any) => {
          if (e.seller_company === this.invoiceSellerSelect.value) {
            return e
          }
        })


      }
      if (this.nbfcSelect.value) {
        invoiceData = invoiceData.filter((e: any) => {
          if (e.nbfc_name == this.nbfcSelect.value) {
            return e
          }
        })

      }

      if (this.invoiceDate && start_date && end_date) {
        invoiceData = invoiceData.filter((e: any) => {
          if (e.invoice_date) {
            if (start_date <= e.invoice_date.split('T')[0] && end_date >= e.invoice_date.split('T')[0]) {
              return e
            }
          }
        })
      }
      if (invoiceData.length > 0) {
        this.modifyInvoiceData(invoiceData)
        this.tempInvoice = invoiceData
      } else {
        this.snackbar.open("data not found for given filter", "close")
      }
    }

    if (filterType == 'overdue seller column') {
      let overdue: any = {};
      let overdue30 = this.overdue.overdue30
      let overdue60 = this.overdue.overdue60
      let overdue90 = this.overdue.overdue90
      let overdue120 = this.overdue.overdue120
      if (this.overDueSeller.value) {
        overdue30 = overdue30.filter((element: any) => {
          if (element.seller_company == this.overDueSeller.value) {
            return element
          }
        });
        overdue60 = overdue60.filter((element: any) => {
          if (element.seller_company == this.overDueSeller.value) {
            return element
          }
        });
        overdue90 = overdue90.filter((element: any) => {
          if (element.seller_company == this.overDueSeller.value) {
            return element
          }
        });
        overdue120 = overdue120.filter((element: any) => {
          if (element.seller_company == this.overDueSeller.value) {
            return element
          }
        });
      }

      if (this.overDue_nbfc.value) {
        overdue30 = overdue30.filter((element: any) => {
          if (element.nbfc_name == this.overDue_nbfc.value) {
            return element
          }
        });
        overdue60 = overdue60.filter((element: any) => {
          if (element.nbfc_name == this.overDue_nbfc.value) {
            return element
          }
        });
        overdue90 = overdue90.filter((element: any) => {
          if (element.nbfc_name == this.overDue_nbfc.value) {
            return element
          }
        });
        overdue120 = overdue120.filter((element: any) => {
          if (element.nbfc_name == this.overDue_nbfc.value) {
            return element
          }
        });
      }

      overdue = {
        overdue30: overdue30,
        overdue60: overdue60,
        overdue90: overdue90,
        overdue120: overdue120
      }
      this.modifyInvoiceOverdueData1(overdue);
      this.tempOverdue = overdue


    }

    if (filterType == 'payment') {
      this.paymentArr = [];
      this.paymentDueArr = [];
      this.paymentReceivedArr = [];

      this.paymentValueArr = [];
      this.paymentDueValueArr = [];
      this.paymentReceivedValueArr = [];

      this.totalPaymentCount = 0
      this.duePaymentCount = 0
      this.receivedPaymentCount = 0
      this.totalPaymentValue = 0
      this.duePaymentValue = 0
      this.receivedPaymentValue = 0

      this.payment_x_axis = [];

      if (this.paymentSeller.value) {
        this.payment.total = this.payment.total.filter((ele: any) => {
          if (this.paymentSeller.value == ele.seller_name) {
            return ele
          }
        })
        this.payment.due = this.payment.due.filter((ele: any) => {
          if (this.paymentSeller.value == ele.seller_name) {
            return ele
          }
        })
        this.payment.received = this.payment.received.filter((ele: any) => {
          if (this.paymentSeller.value == ele.seller_name) {
            return ele
          }
        })
      }


      if (this.paymentDate.value) {
        let start1: any = parseInt(moment(new Date()).subtract(this.paymentDate.value, 'month').locale('en').format('MM'));
        let end1: any = parseInt(moment(new Date()).locale('en').format('MM'))
        let i: any = start1;

        do {
          i++;
          if (i > 12) {
            i = 1
          }
          this.payment_x_axis.push(moment(i, 'MM').locale('en').format('MMM'))
        } while (i != end1);
        for (let i = 0; i < this.paymentDate.value; i++) {
          this.paymentArr[i] = 0;
          this.paymentDueArr[i] = 0;
          this.paymentReceivedArr[i] = 0;
          this.paymentValueArr[i] = 0;
          this.paymentDueValueArr[i] = 0;
          this.paymentReceivedValueArr[i] = 0;
        }
        for (let i = 0; i < this.payment_x_axis.length; i++) {
          for (let j = 0; j < this.payment.total.length; j++) {
            if (moment(this.payment.total[j]?.payment_date?.split('T')[0]).locale('en').format('MMM') == this.payment_x_axis[i]) {
              this.paymentArr[i] += 1;

              if (this.payment.total[j].settle_amount) {
                this.paymentValueArr[i] += parseInt(this.payment.total[j].settle_amount)
              }
            }

          }
          for (let j = 0; j < this.payment.due.length; j++) {
            if (moment(this.payment.due[j]?.last_payment_date?.split('T')[0]).locale('en').format('MMM') == this.payment_x_axis[i]) {
              this.paymentDueArr[i] += 1;
              if (this.payment.due[j].outstanding_amount) {
                this.paymentDueValueArr[i] += parseInt(this.payment.due[j].outstanding_amount)
              }
            }
          }
          for (let j = 0; j < this.payment.received.length; j++) {
            if (moment(this.payment.received[j]?.payment_date?.split('T')[0]).locale('en').format('MMM') == this.payment_x_axis[i]) {
              this.paymentReceivedArr[i] += 1
              if (this.payment.received[j].settle_amount) {
                this.paymentReceivedValueArr[i] += parseInt(this.payment.received[j].settle_amount)
              }
            }
          }


        }
        //Count

        for (let temp of this.paymentArr) {
          this.totalPaymentCount += temp
        }
        for (let temp of this.paymentDueArr) {
          this.duePaymentCount += temp
        }
        for (let temp of this.paymentReceivedArr) {
          this.receivedPaymentCount += temp
        }
        //Value

        for (let temp of this.paymentValueArr) {
          this.totalPaymentValue += temp
        }
        for (let temp of this.paymentDueValueArr) {
          this.duePaymentValue += temp
        }
        for (let temp of this.paymentReceivedValueArr) {
          this.receivedPaymentValue += temp
        }

        this.paymentTypeFilter();
      }
    }
    if (filterType == 'payment trends') {

      this.partpayArr = [];
      this.paidArr = [];

      this.partpayArrValue = [];
      this.paidArrValue = [];

      this.trendsPaidCount = 0
      this.trendsPartpayCount = 0;
      this.trendsPaidValue = 0;
      this.trendsPartpayValue = 0;
      this.trends_x_axis = [];

      if (this.paymentTrendsSeller.value) {
        this.paymentTrends.paid = this.paymentTrends.paid.filter((ele: any) => {
          if (this.paymentTrendsSeller.value == ele.seller_name) {
            return ele
          }
        })
        this.paymentTrends.partpay = this.paymentTrends.partpay.filter((ele: any) => {
          if (this.paymentTrendsSeller.value == ele.seller_name) {
            return ele
          }
        })

      }
      if (this.paymentTrendsDate.value) {

        let start1: any = parseInt(moment(new Date()).subtract(this.paymentTrendsDate.value, 'month').locale('en').format('MM'));
        let end1: any = parseInt(moment(new Date()).locale('en').format('MM'))
        let i: any = start1;
        do {
          i++;
          if (i > 12) {
            i = 1
          }
          this.trends_x_axis.push(moment(i, 'MM').locale('en').format('MMM'))
        } while (i != end1);
        for (let i = 0; i < this.paymentTrendsDate.value; i++) {
          this.partpayArr[i] = 0;
          this.paidArr[i] = 0;

          this.partpayArrValue[i] = 0;
          this.paidArrValue[i] = 0;
        }
        for (let i = 0; i < this.trends_x_axis.length; i++) {
          for (let j = 0; j < this.paymentTrends.paid.length; j++) {
            if (moment(this.paymentTrends?.paid[j]?.last_payment_date?.split('T')[0]).locale('en').format('MMM') == this.trends_x_axis[i]) {
              this.paidArr[i] += 1;
              if (this.paymentTrends.paid[j]?.outstanding_amount) {
                this.paidArrValue[i] += parseInt(this.paymentTrends.paid[j]?.outstanding_amount)
              }
            }
          }
          for (let j = 0; j < this.paymentTrends.partpay.length; j++) {
            if (moment(this.paymentTrends?.partpay[j]?.last_payment_date?.split('T')[0]).locale('en').format('MMM') == this.trends_x_axis[i]) {
              this.partpayArr[i] += 1;
              if (this.paymentTrends.partpay[j]?.outstanding_amount) {
                this.partpayArrValue[i] += parseInt(this.paymentTrends.partpay[j]?.outstanding_amount)
              }
            }
          }
        }
        for (let temp of this.paidArr) {
          this.trendsPaidCount += temp
        }
        for (let temp of this.partpayArr) {
          this.trendsPartpayCount += temp
        }

        for (let temp of this.paidArrValue) {
          this.trendsPaidValue += temp
        }
        for (let temp of this.partpayArrValue) {
          this.trendsPartpayValue += temp
        }

        this.paymentTrendsFilter();



      }
    }
    if (filterType == 'retailers') {
      this.retailersArr = [];
      this.holdRetailersArr = [];
      this.inactiveRetailersArr = [];
      this.inprogressRetailersArr = [];
      this.approveddRetailersArr = [];


      this.totalRetailerCount = 0;
      this.holdRetailerCount = 0;
      this.inprogressCount = 0;
      this.inactiveRetailerCount = 0;
      this.approvedCount = 0;

      this.approvedRetailers = 0
      this.inprogressRetailers = 0
      this.inactiveRetailers = 0
      this.holdRetailers = 0
      this.totalRetailers = 0

      this.retailers_x_axis = [];

      if (this.retailerSeller.value) {
        this.retailers.total = this.retailers?.total?.filter((ele: any) => {
          if (this.retailerSeller.value == ele?.company_name) {
            return ele
          }
        })
        this.retailers.hold = this.retailers?.hold?.filter((ele: any) => {
          if (this.retailerSeller.value == ele?.company_name) {
            return ele
          }
        })
        this.retailers.approved = this.retailers?.approved?.filter((ele: any) => {
          if (this.retailerSeller.value == ele?.company_name) {
            return ele
          }
        })

        this.retailers.inactive = this.retailers?.inactive?.filter((ele: any) => {
          if (this.retailerSeller.value == ele?.company_name) {
            return ele
          }
        })

        this.retailers.inprogress = this.retailers?.inprogress?.filter((ele: any) => {
          if (this.retailerSeller.value == ele?.company_name) {
            return ele
          }
        })
      }


      if (this.retailerDate.value) {
        let start1: any = parseInt(moment(new Date()).subtract(this.retailerDate.value, 'month').locale('en').format('MM'));
        let end1: any = parseInt(moment(new Date()).locale('en').format('MM'))
        let i: any = start1;

        do {
          i++;
          if (i > 12) {
            i = 1
          }
          this.retailers_x_axis.push(moment(i, 'MM').locale('en').format('MMM'))
        } while (i != end1);
        for (let i = 0; i < this.retailerDate.value; i++) {
          this.retailersArr[i] = 0;
          this.holdRetailersArr[i] = 0;
          this.inactiveRetailersArr[i] = 0;
          this.inprogressRetailersArr[i] = 0;
          this.approveddRetailersArr[i] = 0;

        }
        for (let i = 0; i < this.retailers_x_axis.length; i++) {
          for (let j = 0; j < this.retailers.total.length; j++) {
            if (moment(this.retailers.total[j]?.createdAt).locale('en').format('MMM') == this.retailers_x_axis[i]) {
              this.retailersArr[i] += 1;
            }
          }
          for (let j = 0; j < this.retailers.approved.length; j++) {
            if (moment(this.retailers.approved[j]?.createdAt).locale('en').format('MMM') == this.retailers_x_axis[i]) {
              this.approveddRetailersArr[i] += 1;
            }
          }
          for (let j = 0; j < this.retailers.hold.length; j++) {
            if (moment(this.retailers.hold[j]?.createdAt).locale('en').format('MMM') == this.retailers_x_axis[i]) {
              this.holdRetailersArr[i] += 1
            }
          }
          for (let j = 0; j < this.retailers.inactive.length; j++) {
            if (moment(this.retailers.inactive[j]?.createdAt).locale('en').format('MMM') == this.retailers_x_axis[i]) {
              this.inactiveRetailersArr[i] += 1
            }
          }
          for (let j = 0; j < this.retailers.inprogress.length; j++) {
            if (moment(this.retailers.inprogress[j]?.createdAt).locale('en').format('MMM') == this.retailers_x_axis[i]) {
              this.inprogressRetailersArr[i] += 1
            }
          }
        }
        //Count
        for (let temp of this.retailersArr) {
          this.totalRetailers += temp
        }
        for (let temp of this.holdRetailersArr) {
          this.holdRetailers += temp
        }
        for (let temp of this.inactiveRetailersArr) {
          this.inactiveRetailers += temp
        }
        for (let temp of this.inprogressRetailersArr) {
          this.inprogressRetailers += temp
        }
        for (let temp of this.approveddRetailersArr) {
          this.approvedRetailers += temp
        }

      }
      this.getRetailerFilter();
    }

    if(filterType == 'nbfc map'){
      let nbfc_mapped_data = this.nbfc_mapped_data;
     this.nbfc_mapped=[];
     this.nbfc_x_axis=[];
     this.nbfcCount = 0;
     if(this.nbfc_mapped_name.value){
      nbfc_mapped_data = nbfc_mapped_data?.filter((ele: any) => {
        if (this.nbfc_mapped_name.value == ele?.nbfc_name) {
          return ele
        }
      })
     }
      if (this.nbfcDate.value) {
        let start1: any = parseInt(moment(new Date()).subtract(this.nbfcDate.value, 'month').locale('en').format('MM'));
        let end1: any = parseInt(moment(new Date()).locale('en').format('MM'))
        let i: any = start1;

        do {
          i++;
          if (i > 12) {
            i = 1
          }
          this.nbfc_x_axis.push(moment(i, 'MM').locale('en').format('MMM'))
        } while (i != end1);
       
        for (let i = 0; i < this.nbfcDate.value; i++) {
          this.nbfc_mapped[i] = 0;
        }
        for (let i = 0; i < this.nbfc_x_axis.length; i++) {
          for (let j = 0; j < nbfc_mapped_data.length; j++) {
            if (moment(nbfc_mapped_data[j]?.nbfc_mapping_date).locale('en').format('MMM') == this.nbfc_x_axis[i]) {
              this.nbfc_mapped[i] += 1;
            }
          }
        }
      }
      for(let temp of this.nbfc_mapped){
        this.nbfcCount+=temp;
      }
      this.nbfcMappedAnalysis();
      this.temp_nbfc_mapped = nbfc_mapped_data
    }
  }
  modifyInvoiceData(invoiceData: any) {
    this.invoiceChartFlag = true;
    this.invoiceTotalCount = 0;
    this.invoicePaidCount = 0;
    this.invoicePendingCount = 0;
    this.invoiceConfirmedCount = 0;
    this.invoiceRejectedCount = 0;

    this.invoiceTotalValue = 0;
    this.invoicePaidValue = 0;
    this.invoicePendingValue = 0;
    this.invoiceConfirmedValue = 0;
    this.invoiceRejectedValue = 0;

    this.invoiceTotalCount = invoiceData?.length;
    for (let i = 0; i < invoiceData.length; i++) {
      if (invoiceData[i].total_invoice_amount) {
        this.invoiceTotalValue += parseInt(invoiceData[i].total_invoice_amount);
      }
    }

    for (let i = 0; i < invoiceData.length; i++) {
      if (invoiceData[i].invoice_sattus == 'Confirmed') {
        this.invoiceConfirmedCount++;
        if (invoiceData[i].total_invoice_amount) {
          this.invoiceConfirmedValue += parseInt(invoiceData[i].total_invoice_amount);

        }
      }
      else if (invoiceData[i].invoice_sattus == 'Pending') {
        this.invoicePendingCount++;
        if (invoiceData[i].total_invoice_amount) {
          this.invoicePendingValue += parseInt(invoiceData[i].total_invoice_amount);
        }

      }
      else if (invoiceData[i].invoice_sattus == 'Paid') {
        this.invoicePaidCount++;
        if (invoiceData[i].total_invoice_amount) {
          this.invoicePaidValue += parseInt(invoiceData[i].total_invoice_amount);
        }

      }
      else if (invoiceData[i].invoice_sattus == 'Rejected') {
        this.invoiceRejectedCount++;
        if (invoiceData[i].total_invoice_amount) {
          this.invoiceRejectedValue += parseInt(invoiceData[i].total_invoice_amount);
        }
      }
    }

    this.invoiceTotal = this.invoiceTotalCount;
    this.invoicePending = this.invoicePendingCount;
    this.invoiceRejected = this.invoiceRejectedCount;
    this.invoiceConfirmed = this.invoiceConfirmedCount;
    this.invoicePaid = this.invoicePaidCount;

    this.getInvoiceChart();

  }
  modifyOverdueData(overdue_details: any) {

    

    this.overDue_0_count = 0;
    this.overDue_30_count = 0;
    this.overDue_60_count = 0;
    this.overDue_90_count = 0;

    this.overDue_0_value = 0;
    this.overDue_30_value = 0;
    this.overDue_60_value = 0;
    this.overDue_90_value = 0;

    for (let i = 0; i < overdue_details?.overdue_0_30.length; i++) {
      this.overDue_0_value += overdue_details?.overdue_0_30[i].outstanding_amount;
    }

    for (let i = 0; i < overdue_details?.overdue_30_60.length; i++) {
      this.overDue_30_value += overdue_details?.overdue_30_60[i].outstanding_amount;
    }


    for (let i = 0; i < overdue_details?.overdue_60_90.length; i++) {
      this.overDue_60_value += overdue_details?.overdue_60_90[i].outstanding_amount;
    }

    for (let i = 0; i < overdue_details?.overdue_90_120.length; i++) {
      this.overDue_90_value += overdue_details?.overdue_90_120[i].outstanding_amount;
    }

    this.overDue_0_count = overdue_details?.overdue_0_30.length;
    this.overDue_30_count = overdue_details?.overdue_30_60.length;
    this.overDue_60_count = overdue_details?.overdue_60_90.length;
    this.overDue_90_count = overdue_details?.overdue_90_120.length;


    this.overDue_0 = this.overDue_0_count;
    this.overDue_30 = this.overDue_30_count;
    this.overDue_60 = this.overDue_60_count;
    this.overDue_90 = this.overDue_90_count;

    this.invoiceOverDueCharts();

  }



  seller_Name_clear() {

  }

  invoiceTypeFilter() {
    this.getInvoiceChart();
  }


  overdueTypeFilter() {
    this.invoiceOverDueCharts();

  }

  overallTypeFilter() {
    this.overallChartArr=[];
    this.overallDisbursedChartArr=[];
    this.overallPaidChartArr=[]
    if (this.overallType == 'invoiceAmount') {
      for(let i = 0; i < this.overallInvoiceArrValue.length; i++){
        this.overallChartArr[i]=this.overallInvoiceArrValue[i]
      }

      for(let i = 0; i < this.overallDisbursedArrValue.length; i++){
        this.overallDisbursedChartArr[i]=this.overallDisbursedArrValue[i]
      }

      for(let i = 0; i < this.overallPaidArrValue.length; i++){
        this.overallPaidChartArr[i]=this.overallPaidArrValue[i]
      }

     this.overallInvoice = this.overallInvoiceValue
     this.overallInvoicePaid = this.overallInvoicePaidValue
     this.overallInvoiceDisbursed = this.overallDisbursedValue

    }
    else {
      for(let i = 0; i < this.overallInvoiceArr.length; i++){
        this.overallChartArr[i]=this.overallInvoiceArr[i]
      }

      for(let i = 0; i < this.overallDisbursedArr.length; i++){
        this.overallPaidChartArr[i]=this.overallDisbursedArr[i]
      }

      for(let i = 0; i < this.overallPaidArr.length; i++){
        this.overallDisbursedChartArr[i]=this.overallPaidArr[i]
      }

     this.overallInvoice = this.overallInvoiceCount
     this.overallInvoicePaid = this.overallInvoicePaidCount
     this.overallInvoiceDisbursed = this.overallDisbursedCount

    }
    
    this.monthlyInvoiceAnalysisChart();
  }

  paymentTypeFilter() {
    this.paymentChartArr=[];
    this.paymentDueChartArr=[]
    this.paymentReceivedChartArr=[]
    if(this.paymentType=='paymentAmount'){
      for(let i = 0; i < this.paymentValueArr.length; i++){
        this.paymentChartArr[i]=this.paymentValueArr[i]
      }

      for(let i = 0; i < this.paymentReceivedValueArr.length; i++){
        this.paymentReceivedChartArr[i]=this.paymentReceivedValueArr[i]
      }

      for(let i = 0; i < this.paymentDueValueArr.length; i++){
        this.paymentDueChartArr[i]=this.paymentDueValueArr[i]
      }

      this.totalPayment = this.totalPaymentValue
      this.duePayment = this.duePaymentValue
      this.receivedPayment = this.receivedPaymentValue
    }else{
      for(let i = 0; i < this.paymentArr.length; i++){
        this.paymentChartArr[i]=this.paymentArr[i]
      }

      for(let i = 0; i < this.paymentReceivedArr.length; i++){
        this.paymentReceivedChartArr[i]=this.paymentReceivedArr[i]
      }

      for(let i = 0; i < this.paymentDueArr.length; i++){
        this.paymentDueChartArr[i]=this.paymentDueArr[i]
      }

     this.totalPayment = this.totalPaymentCount
     this.duePayment = this.duePaymentCount
     this.receivedPayment = this.receivedPaymentCount
    }
    this.paymentAnalysis();
  }

  paymentTrendsFilter(){
    this.trendschartPaidArr=[]
  this.trendschartPartpayArr=[]
  if(this.paymentTrendsType=='paymentAmount'){
    for(let i = 0; i < this.paidArrValue.length; i++){
      this.trendschartPaidArr[i]=this.paidArrValue[i]
    }

    for(let i = 0; i < this.partpayArrValue.length; i++){
      this.trendschartPartpayArr[i]=this.partpayArrValue[i]
    }

    this.trendsPaid = this.trendsPaidValue
    this.trendsPartpay = this.trendsPartpayValue
  }else{
    for(let i = 0; i < this.paidArr.length; i++){
      this.trendschartPaidArr[i]=this.paidArr[i]
    }

    for(let i = 0; i < this.partpayArr.length; i++){
      this.trendschartPartpayArr[i]=this.partpayArr[i]
    }

    this.trendsPaid = this.trendsPaidValue
    this.trendsPartpay = this.trendsPartpayCount
  }

  this.paymentTrendsAnalysis();
  
  }
  getInvoiceChart(): void {

    if (this.invoiceType == 'invoiceAmount') {
      this.invoiceTotal = this.invoiceTotalValue
      this.invoicePending = this.invoicePendingValue;
      this.invoiceRejected = this.invoiceRejectedValue;
      this.invoiceConfirmed = this.invoiceConfirmedValue;
      this.invoicePaid = this.invoicePaidValue
      this.invoicePartPay = this.invoicePartPayValue
    } else {
      this.invoiceTotal = this.invoiceTotalCount
      this.invoicePending = this.invoicePendingCount;
      this.invoiceRejected = this.invoiceRejectedCount;
      this.invoiceConfirmed = this.invoiceConfirmedCount;
      this.invoicePaid = this.invoicePaidCount;
      this.invoicePartPay = this.invoicePartPayCount
    }

    Highcharts.setOptions({
      colors: ['#ffbc2191', '#ff000091', '#00800091', '#9350ce91']
    });

    this.invoiceOption = {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 50,
          beta: 5
        },
        width: 350,
        height: 350
      },
      title: {
        text: '',

      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      tooltip: {
        pointFormat: '{point.y}( <b>{point.percentage:.1f}%)</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 35,
          dataLabels: {
            enabled: false,
            format: '{point.name}'
          },
          showInLegend: true,
          shadow: true,
          size: '100%',
          innerSize: '0%'
        },
        series: {
          cursor: 'pointer',
          events: {
            click: function (event: any) {
            }
          }
        }
      },
      credits: { enabled: false },
      series: [{
        type: 'pie',
        name: 'Most popular cars',
        data: [
          { name: 'Invoice Pending', y: this.invoicePending, color: '#ffbc2191' },
          { name: 'Invoice Rejected', y: this.invoiceRejected, color: '#ff000091' },
          { name: 'Invoice Confirmed', y: this.invoiceConfirmed, color: '#00800091' },
          { name: 'Invoice Paid', y: this.invoicePaid, color: '#9350ce91' }
        ]
      }]
    }
  }
  monthlyInvoiceAnalysisChart() {
    let total = 0;
    let paid = 0;
    let disbursed = 0;

    
    this.monthlyInvoiceAnalysis = {
      chart: {
        type: "column",
        width: 350,
        height: 350,
        options3d: {
          enabled: true,
          alpha: 0,
          beta: 0
        }
      },
      title: {
        text: ""
      },
      // stackLabel: {
      //   enable: true
      // },
      subtitle: {
        text: ""
      },
      xAxis: {
        categories: this.overall_x_axis
      },
      yAxis: {
        title: {
          text: ""
        }
      },
      plotOptions: {
        column: {
          colorByPoint: false,
          // groupPadding: 0.3,
          // stacking: 'normal',
        },
        // series: {
        //   pointWidth: 30
        // }
      },
      tooltip: {
        valueSuffix: " "
      },
      series: [
        {
          showInLegend: false,
          name: "Total",
          data: this.overallChartArr,
          color: '#9350ce91'
        },
        {
          showInLegend: false,
          name: "Paid",
          data: this.overallPaidChartArr,
          color: '#00800091'
        },
        {
          showInLegend: false,
          name: "Disbursed",
          data: this.overallDisbursedChartArr,
          color: '#ffbc21cd'
        },

      ]
    }
  }
  invoiceOverDueCharts(): void {
    if (this.overDueType == 'overdueAmount') {
      this.overDue_0 = this.overDue_0_value;
      this.overDue_30 = this.overDue_30_value;
      this.overDue_60 = this.overDue_60_value;
      this.overDue_90 = this.overDue_90_value;
    } else {
      this.overDue_0 = this.overDue_0_count;
      this.overDue_30 = this.overDue_30_count;
      this.overDue_60 = this.overDue_60_count;
      this.overDue_90 = this.overDue_90_count;
    }
    let overdueYAxis;
    overdueYAxis = 'INVOICE COUNT'
    Highcharts.setOptions({
      colors: ['#00800091', '#9350ce91', '#ffbc21cd', '#ff0000cd']
    });
    this.invoiceOverDue = {
      chart: {
        type: "column",
        inverted: false,
        width: 300,
        height: 350,
        options3d: {
          enabled: true,
          alpha: 0,
          beta: -25,
          depth: 100,
          viewDistance: 25
        }
      },
      title: {
        text: "OVERDUE INVOICE"
      },
      subtitle: {
        text: ""
      },
      xAxis: {
        categories: ["0-30", "30-60", "60-90", "90-120"],

      },
      yAxis: {
        title: {
          text: overdueYAxis
        }
      },
      plotOptions: {
        column: {
          colorByPoint: true,
        }
      },
      tooltip: {
        valueSuffix: " "
      },
      series: [
        {
          name: "Overdue Invoices(Days)",
          data: [
            { name: '0-30 Days', y: this.overDue_0, color: '#00800091' },
            { name: '30-60 Days', y: this.overDue_30, color: '#9350ce91' },
            { name: '60-90 Days', y: this.overDue_60, color: '#ffbc21cd' },
            { name: '90-120 Days', y: this.overDue_90, color: '#ff0000cd' }
          ]
        }
      ]
    }
  }
  getRetailerFilter() {
    this.retailerOption = {
      chart: {
        type: "column",
        width: 350,
        height: 350,
        options3d: {
          enabled: true,
          alpha: 0,
          beta: 0,
        }
      },
      title: {
        text: ""
      },
      xAxis: {
        categories:this.retailers_x_axis

      },
      yAxis: {
        title: {
          text: ""
        }
      },
      // stackLabel: {
      //   enable: true
      // },
      plotOptions: {
        column: {
          colorByPoint: false,
          // stacking:'normal'
        }
      },
      tooltip: {
        valueSuffix: ""
      },
      series: [
        {
          name:'Hold',
          data:this.holdRetailersArr,
          color:'orange'
        },
        {
          name:'Inactive',
          data:this.inactiveRetailersArr,
          color:'black'
        },
        {
          name:'Inprogress',
          data:this.inprogressRetailersArr,
          color:'purple'
        },
        {
          name:'Approved',
          data:this.approveddRetailersArr,
          color:'green'
        },
      ]
    }
  }
  paymentAnalysis() {
    this.paymentChart = {
      chart: {
        type: "column",
        inverted: false,
        width: 350,
        height: 350,
        options3d: {
          enabled: true,
          alpha: 0,
          beta: 0,
        }
      },
      title: {
        text: ""
      },
      subtitle: {
        text: ""
      },
      // stackLabel:{
      //   enable:true,
      // },
      xAxis: {
        categories: this.payment_x_axis,

      },
      yAxis: {
        title: {
          text: ""
        }
      },
      plotOptions: {
        column: {
          colorByPoint: false,
          // stacking:'normal'
        }
      },
      tooltip: {
        valueSuffix: " "
      },
      series: [
        {
          name: 'Total',
          data: this.paymentChartArr,
          color: '#9350ce91'
        },
        {
          name: 'Due',
          data: this.paymentDueChartArr,
          color: '#00800091'
        },
        {
          name: 'Received',
          data: this.paymentReceivedChartArr,
          color: '#ffbc21cd'
        }
      ]
    }
  }

  paymentTrendsAnalysis() {
    this.paymentTrendsChart = {
      chart: {
        type: "column",
        inverted: false,
        width: 350,
        height: 350,
        options3d: {
          enabled: true,
          alpha: 0,
          beta: 0,
        }
      },
      title: {
        text: ""
      },
      subtitle: {
        text: ""
      },
      // stackLabel:{
      //   enable:true,
      // },
      xAxis: {
        categories: this.trends_x_axis,

      },
      yAxis: {
        title: {
          text: ""
        }
      },
      plotOptions: {
        column: {
          colorByPoint: false,
          // stacking:'normal'
        }
      },
      tooltip: {
        valueSuffix: " "
      },
      series: [
        {
          name: 'Paid',
          data: this.trendschartPaidArr,
          color: '#9350ce91'
        },
        {
          name: 'Partpay',
          data: this.trendschartPartpayArr,
          color: '#00800091'
        }
      ]
    }
  }

  nbfcMappedAnalysis() {
    this.nbfc_mapped_chart = {
      chart: {
        type: "column",
        inverted: false,
        width: 350,
        height: 350,
        options3d: {
          enabled: true,
          alpha: 0,
          beta: 0,
        }
      },
      title: {
        text: ""
      },
      subtitle: {
        text: ""
      },
      // stackLabel:{
      //   enable:true,
      // },
      xAxis: {
        categories: this.nbfc_x_axis

      },
      yAxis: {
        title: {
          text: ""
        }
      },
      plotOptions: {
        column: {
          colorByPoint: false,
          // stacking:'normal'
        }
      },
      tooltip: {
        valueSuffix: " "
      },
      series: [
        {
          name:'',
          data:this.nbfc_mapped,
          color:''
        }
      ]
    }
  }
}


