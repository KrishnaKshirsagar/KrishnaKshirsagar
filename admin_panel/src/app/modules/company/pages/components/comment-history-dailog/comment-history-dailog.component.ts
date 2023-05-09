import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DATE_FORMAT } from 'src/app/shared/constants/constants';
import { ApiService } from '../../../services/api/api.service';

@Component({
  selector: 'app-comment-history-dailog',
  templateUrl: './comment-history-dailog.component.html',
  styleUrls: ['./comment-history-dailog.component.scss']
})
export class CommentHistoryDailogComponent implements OnInit,AfterViewInit {
  durationInSeconds = 2;

  commented_data:any=[];

  date_format = DATE_FORMAT + 'h:mm:ss a';

  comment_category = "";

  constructor
  (
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _liveAnnouncer: LiveAnnouncer,
    private fb : FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<CommentHistoryDailogComponent>
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {

    this.comment_form = this.fb.group({
      comment: ["", [Validators.required]],
      comment_category : ["",[Validators.required]]
    }); 
    this.get_company_comments_by_id();   
  }

  comment_form!: FormGroup;
  
  dataSource = new MatTableDataSource([]);

   displayedColumns1: string[] = [
     "comment",
     "commented_by",
     "createdAt", 
   ];
  
   announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  // get company comments by id
  get_company_comments_by_id(){
    this.apiService.get_company_comments_by_id(this.data.object.company_id).subscribe((res:any)=>{
      if (res.status == true) {
        this.dataSource = new MatTableDataSource(res.data);
        this.commented_data= this.dataSource.data
        this.dataSource.paginator = this.paginator;
      }
      else {
        this.dataSource = new MatTableDataSource([]);
        this.snackBar.open(res.message, "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }); 
      }
    })
  }

  // add company comments by id
  add_comment(){
    const userId = sessionStorage.getItem("LoginId");
    if (this.comment_form.valid) {
      let obj = {
        userId  : userId,
        gstin   : this.data.object.gst,
        comment : this.comment_form.value.comment,
        comment_category : this.comment_form.value.comment_category 
      }
      this.apiService.add_comment(obj).subscribe((res:any)=>{
        if (res.status == true) 
        {
          this.snackBar.open(res.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
          const dialogRef = this.dialog.closeAll();
        } 
        else 
        {
          this.snackBar.open(res.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }); 
        }
      })
    }
  }
}
