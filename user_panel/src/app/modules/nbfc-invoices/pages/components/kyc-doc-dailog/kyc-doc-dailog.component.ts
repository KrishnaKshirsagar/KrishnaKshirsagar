import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-kyc-doc-dailog',
  templateUrl: './kyc-doc-dailog.component.html',
  styleUrls: ['./kyc-doc-dailog.component.scss']
})
export class KycDocDailogComponent implements OnInit {

  src : any
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<KycDocDailogComponent>,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.src = this.data.url
    this.src =  this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
  }
}
