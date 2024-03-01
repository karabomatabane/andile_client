import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SpinnerOverlayComponent } from '../utils/spinner-overlay/spinner-overlay.component';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private spinnerDialogRef: MatDialogRef<SpinnerOverlayComponent> | undefined;

  constructor(private dialog: MatDialog) { }

  showSpinnerOverlay(): void {
    // Open the spinner overlay and keep a reference to its dialog
    this.spinnerDialogRef = this.dialog.open(SpinnerOverlayComponent, {
      disableClose: true,
      panelClass: 'transparent-dialog-panel'
    });
  }

  hideSpinnerOverlay(): void {
    // Close the spinner overlay dialog if it exists
    if (this.spinnerDialogRef) {
      this.spinnerDialogRef.close();
    }
  }
}
