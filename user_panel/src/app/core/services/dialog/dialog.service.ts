/* eslint-disable security/detect-non-literal-fs-filename */
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ErrorDialogData } from "src/app/shared/interfaces/components/error-dialog-data.interface";
import { InfoDialogData } from "src/app/shared/interfaces/components/info-dialog-data.interface";
import { ErrorDialogComponent } from "../../components/error-dialog/error-dialog.component";
import { InfoDialogComponent } from "../../components/info-dialog/info-dialog.component";

@Injectable({
  providedIn: "root",
})
export class DialogService {
  private isErrorDialogOpen = false;

  private isInfoDialogOpen = false;

  constructor(private _dialog: MatDialog) {}

  openErrorDialog(data: ErrorDialogData) {
    if (this.isErrorDialogOpen) {
      return false;
    }

    this.isErrorDialogOpen = true;

    const dialogRef = this._dialog.open(ErrorDialogComponent, {
      width: "300px",
      data,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.isErrorDialogOpen = false;
    });

    return true;
  }

  openInfoDialog(data: InfoDialogData) {
    if (this.isInfoDialogOpen) {
      return false;
    }

    this.isInfoDialogOpen = true;

    const dialogRef = this._dialog.open(InfoDialogComponent, {
      width: "300px",
      data,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.isInfoDialogOpen = false;
    });

    return true;
  }
}
