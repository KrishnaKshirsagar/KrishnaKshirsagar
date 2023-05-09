import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ErrorDialogData } from "src/app/shared/interfaces/components/error-dialog-data.interface";

@Component({
  selector: "app-error-dialog",
  templateUrl: "./error-dialog.component.html",
  styleUrls: ["./error-dialog.component.scss"],
})
export class ErrorDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorDialogData
  ) {}

  codeTitle!: string;

  ngOnInit(): void {
    switch (this.data.code) {
      case 400: {
        this.codeTitle = "Bad Request";
        break;
      }
      case 401: {
        this.codeTitle = "Unauthorized";
        break;
      }
      case 403: {
        this.codeTitle = "Forbidden";
        break;
      }
      case 404: {
        this.codeTitle = "Not Found";
        break;
      }
      case 500: {
        this.codeTitle = "Internal Server Error";
        break;
      }
      default: {
        this.codeTitle = "Error";
        break;
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
