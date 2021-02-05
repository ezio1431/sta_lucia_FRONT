import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { BranchService } from '../../settings/branch/general/data/branch.service';
import * as moment from 'moment';
import { FinanceStatementService } from '../data/finance-statement.service';
import { FinanceStatementModel } from '../models/finance-statement.model';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../reducers';
// import { branch, settings } from '../../auth/auth.selectors';
import { MatDialog } from '@angular/material/dialog';
import { ReportService } from '../data/report.service';
import { NotificationService } from '../../shared/notification.service';
import { of } from 'rxjs';

@Component({
    selector: 'robi-finance',
    templateUrl: './finance.component.html',
    styleUrls: ['./finance.component.css']
})
export class FinanceComponent implements OnInit {
    form: FormGroup;
    formErrors: any;

    branches: any;
    statementTypes: any;

    financeStatement: FinanceStatementModel;

    branchId: any;
    now: any;
    loader = false;

    currentSettings$: any;
    businessName: any;

    constructor(private reportService: ReportService, private fb: FormBuilder, private store: Store<AppState>,
                private branchService: ReportService, private financeStatementService: FinanceStatementService,
                private dialog: MatDialog, private notification: NotificationService) {
       // this.store.pipe(select(branch)).subscribe(user => this.branchId = user);

        this.now = new Date();
       // this.currentSettings$ = this.store.pipe(select(settings));
        this.currentSettings$ = of([]);
        this.currentSettings$.subscribe(res => {
            if (res) {
                this.businessName = res.business_name
            }
        });

    }

    /**
     *
     */
    ngOnInit() {
        this.form = this.fb.group({
            start_date: [''],
            end_date: [moment()],
            statement_type_id: ['', [Validators.required,
                Validators.minLength(1)]],
            branch_id: [this.branchId, [Validators.required,
                Validators.minLength(1)]],
        });

        this.branchService.list(['name'])
            .subscribe((res) => this.branches = res,
                () => this.branches = []
            );

        this.financeStatementService.list(['name', 'display_name'])
            .subscribe((res) => this.statementTypes = res,
                () => this.statementTypes = []
            );
    }

    /**
     *
     */
    downloadReport() {
        this.loader = true;
        const body = Object.assign({}, this.financeStatement, this.form.value);
        this.financeStatementService.downloadReport(body)
            .subscribe((res) => {
                    this.loader = false;
                    this.showFile(res);
                },
                () => {
                    this.loader = false;
                    this.notification.showNotification('danger', 'Error Downloading File!');
                }
            );
    }

    /**
     *
     * @param blob
     */
    private showFile(blob) {
        const newBlob = new Blob([blob], {type: 'application/pdf'});

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }
        const data = window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = data;
        link.download = 'report.pdf';
        link.click();
        setTimeout(function() {
            window.URL.revokeObjectURL(data);
        }, 100);
    }

}
