import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { BranchService } from '../../settings/branch/general/data/branch.service';
import * as moment from 'moment';
import { FinanceStatementService } from '../data/finance-statement.service';
import { FinanceStatementModel } from '../models/finance-statement.model';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../reducers';
// import { branch } from '../../auth/auth.selectors';
import { MatDialog } from '@angular/material/dialog';
import { ReportService } from '../data/report.service';
import { NotificationService } from '../../shared/notification.service';

@Component({
    selector: 'robi-other-reports',
    templateUrl: './other-reports.component.html',
    styleUrls: ['./other-reports.component.css']
})
export class OtherReportsComponent implements OnInit {
    form: FormGroup;
    formErrors: any;

    branches: any;
    statementTypes: any;

    financeStatement: FinanceStatementModel;

    branchId: any;
    docDefinition: any;

    now: any;

    reportTypes: any;

    trialBalanceData: any;
    tableHeader = [
                {text: 'Account', style: 'tableHeader', alignment: 'center'},
                { text: 'DR', style: 'tableHeader', alignment: 'center' },
                {text: 'CR', style: 'tableHeader', alignment: 'center'}
            ];

    constructor(private reportService: ReportService, private fb: FormBuilder, private store: Store<AppState>,
                private branchService: ReportService, private financeStatementService: FinanceStatementService,
                private dialog: MatDialog, private notification: NotificationService) {
      //  this.store.pipe(select(branch)).subscribe(user => this.branchId = user);

        this.now = new Date();
    }

    /**
     *
     */
    ngOnInit() {

        this.form = this.fb.group({
            start_date: ['', [Validators.required,
                Validators.minLength(3)]],
            end_date: [moment()],
            report_type_id: ['', [Validators.required,
                Validators.minLength(1)]],
            branch_id: [this.branchId, [Validators.required,
                Validators.minLength(1)]],
        });

        this.branchService.list(['name'])
            .subscribe((res) => this.branches = res,
                () => this.branches = []
            );

        this.financeStatementService.list(['display_name'])
            .subscribe((res) => this.reportTypes = res,
                () => this.reportTypes = []
            );

        this.reportService.getById(this.branchId)
            .subscribe((res) => {
                    // this.loader = false;
                    this.trialBalanceData = res;
                    // Add headers
                    this.trialBalanceData.unshift(this.tableHeader);

                    this.docDefinition = this.definePdf(this.formatBodyData());
                },
                () => {
                    // this.loader = false;
                    this.trialBalanceData = [];
                }
            );
    }

    formatBodyData() {
        return this.trialBalanceData.map(function (item) {
            return [
                {text: item[0], alignment: 'left'},
                {text: item[1], alignment: 'right'},
                {text: item[2], alignment: 'right'},
            ];
        });
    }

    definePdf(data: any) {
    }

    /**
     *
     */
    downloadPdf() {
        const body = Object.assign({}, this.financeStatement, this.form.value);
    }

    downloadReport() {}

}
