import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { Injectable } from "@angular/core";
import { SpinnerComponent } from "../../components/spinner/spinner.component";

@Injectable({
  providedIn: "root",
})
export class SpinnerService {
  private overlayRef!: OverlayRef;

  isLoading = 0;

  constructor(private overlay: Overlay) {}

  public show() {
    if (!this.isLoading) {
      // Returns an OverlayRef (which is a PortalHost)

      if (!this.overlayRef) {
        this.overlayRef = this.overlay.create();
      }

      // Create ComponentPortal that can be attached to a PortalHost
      const spinnerOverlayPortal = new ComponentPortal(SpinnerComponent);
      this.overlayRef.attach(spinnerOverlayPortal); // Attach ComponentPortal to PortalHost
    }

    this.isLoading += 1;
  }

  public hide() {
    if (!!this.overlayRef && this.isLoading) {
      this.overlayRef.detach();
      this.isLoading -= 1;
    }
  }
}
