import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { tap } from 'rxjs/operators';

@Injectable()
export class FormDialogService implements OnDestroy {

  private backDropSub: Subscription;

  constructor(private delConfirmDialog: MatDialog) { }

  registerForm(dialogRef: MatDialogRef<any>, form: any) {

    dialogRef.disableClose = true;
    this.backDropSub = dialogRef.backdropClick().subscribe(() => {

      if (form.dirty) {
        const confirmDialogRef = this.delConfirmDialog.open(ConfirmationDialogComponent, {
          width: '500px',
          id: 'confirm-dialog',
          data: { message: 'Dialog wirklich schließen? Ungespeicherte Änderungen gehen verloren!' }
        });

        return confirmDialogRef.afterClosed().pipe(
          tap((res: string) => {
            if (res === 'confirm') {
              dialogRef.close();
            }
          })
        ).subscribe();
      }
      dialogRef.close();
    });
  }

  ngOnDestroy() {
    if(this.backDropSub) {
      this.backDropSub.unsubscribe();
    }
  }

}
