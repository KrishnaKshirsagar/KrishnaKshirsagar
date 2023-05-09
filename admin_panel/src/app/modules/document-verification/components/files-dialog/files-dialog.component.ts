import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-files-dialog',
  templateUrl: './files-dialog.component.html',
  styleUrls: ['./files-dialog.component.scss']
})
export class FilesDialogComponent {
  src:any;
  constructor(
    public dialogRef: MatDialogRef<FilesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit() {
    console.log(this.data.files)
    this.src=this.data.files;
    this.src=this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
