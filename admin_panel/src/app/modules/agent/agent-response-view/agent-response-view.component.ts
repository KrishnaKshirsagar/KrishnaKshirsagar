import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { CURRENCY_FORMAT, DATE_FORMAT } from 'src/app/shared/constants/constants';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../service/api/api.service';
import { AgentDialogboxComponent } from './agent-dialogbox/agent-dialogbox.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-agent-response-view',
  templateUrl: './agent-response-view.component.html',
  styleUrls: ['./agent-response-view.component.scss']
})
export class AgentResponseViewComponent implements OnInit {

  public aid: any;

  Date_Format = DATE_FORMAT;

  currency_format = CURRENCY_FORMAT;

  limit = 10;

  length = 0;

  page = 1;

  sortBy!: string;

  search!: string;

  createdAt:any;

  maxDate!: Date;

  transactionDate!: Date;

  displayedColumns: string[] = [

    "Agent_Name",
    "Merchant_Name",
    "gstin",
    "mob_no",
    "visit_date",
    "bussiness_address",
    "comment",
    "preview"
  ];

  nameFilter=new FormControl;
  dataSource = new MatTableDataSource();

  filterValues:any = {
    creatBy: '',
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private apiservice: ApiService,
    private dialogRef: MatDialog
  ) { 
  

  }



  ngOnInit(): void {
    this.getAgentHistory();

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }



  getNewduedate(entity: any) {
    const new_due_date =
      entity && entity.new_due_date && entity.new_due_date != " 23:59:59"
        ? entity.new_due_date
        : "";
    return new_due_date;
  }

  getDueDate(entity: any) {
    const due_date =
      entity && entity.due_date && entity.due_date != " 23:59:59"
        ? entity.due_date
        : "";
    return due_date;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  getAgentHistory() {
    
    this.apiservice.getagentHistory().subscribe((response:any) => {
      if (response.status == true && response.code == "200") {
        const agenthistory = response.message
          ? response.message
          : [];

        this.dataSource = new MatTableDataSource(agenthistory);

        this.dataSource.paginator = this.paginator;

        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "id", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    });
   
  }

  openDialog(element: any) {
    this.aid = element
    console.log(element.id)
    this.dialogRef.open(AgentDialogboxComponent, { data: element, autoFocus: false,
      maxHeight: '100vh' });
  }





  applyFilter(filterValue: any) {
     this.dataSource.filter=filterValue.trim().toLowerCase();
  }


}

