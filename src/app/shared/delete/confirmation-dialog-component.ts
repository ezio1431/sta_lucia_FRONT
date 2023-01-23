import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'robi-confirm-dialog',
    templateUrl: './confirmation-dialog-component.html',
})
export class ConfirmationDialogComponent {
    public confirmMessage: string;

    title: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private translateService: TranslateService,
                public dialogRef: MatDialogRef<ConfirmationDialogComponent>) {
        if (data?.title) {
            this.title = data?.title;
        } else {
            this.title = this.translateService.instant('confirm_permanent_action');
        }
    }

}
