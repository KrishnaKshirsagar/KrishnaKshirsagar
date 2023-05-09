import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from "@angular/platform-browser";
@Component({
  selector: 'app-kyc-doc-dailoag',
  templateUrl: './kyc-doc-dailoag.component.html',
  styleUrls: ['./kyc-doc-dailoag.component.scss']
})
export class KycDocDailoagComponent implements OnInit {
  
  src : any
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<KycDocDailoagComponent>,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.src = this.data.url
    this.src =  this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
  }
}
