import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { LeaseModel } from '../../../../leases/models/lease-model';
import { AppState } from '../../../../reducers';
import { LeaseService } from '../../../../leases/data/lease.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../../shared/notification.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'robi-view-agreement',
    templateUrl: './view-agreement.component.html',
    styleUrls: ['./view-agreement.component.css']
})

export class ViewAgreementComponent implements OnInit  {
    loader = false;
    lease: LeaseModel;

    @ViewChild('pdfViewerAutoLoad') pdfViewerAutoLoad;
    pdfSrc: any;
    domSanitizer: DomSanitizer;
    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private store: Store<AppState>,
                private fb: FormBuilder,
                private leaseService: LeaseService,
                private dialog: MatDialog,
                sanitizer: DomSanitizer,
                private translateService: TranslateService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<ViewAgreementComponent>) {
        this.lease = row.lease;
        this.domSanitizer = sanitizer;
    }

    ngOnInit() {
        this.downloadLeaseAgreement(this.lease?.id)
    }

    downloadLeaseAgreement(leaseID: string) {
        this.loader = true;
        this.leaseService.downloadAgreement({lease_id: leaseID})
            .subscribe((res) => {
                    this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(
                        URL.createObjectURL(res)
                    );
                    this.loader = false;
                },
                () => {
                    this.loader = false;
                    this.notification.showNotification('danger',
                        this.translateService.instant('reports.notifications.download_error'));
                }
            );
    }

    close() {
        this.dialogRef.close();
    }
}
