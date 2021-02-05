import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmationDialogComponent } from '../../shared/delete/confirmation-dialog-component';
import { AccountingDataSource } from '../data/accounting-data.source';
import { AccountingService } from '../data/accounting.service';
import { GeneralJournalService } from '../data/general-journal.service';
import { NotificationService } from '../../shared/notification.service';
// import { MemberService } from '../../members/data/member.service';
// import { BranchService } from '../../settings/branch/general/data/branch.service';
import { AccountingModel } from '../models/accounting-model';
import { StatementComponent } from '../statement/statement.component';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../reducers';
// import { branch } from '../../auth/auth.selectors';

@Component({
    selector: 'robi-ledger',
    templateUrl: './ledger.component.html',
    styleUrls: ['./ledger.component.css']
})
export class LedgerComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'account_number',
        /* 'account_code',*/
        'account_class_id',
        'account_type_id',
        'account_name',
        'balance',
        'actions',
    ];

    loader = false;

    dialogRef: MatDialogRef<ConfirmationDialogComponent>;

    // Search field
    @ViewChild('search') search: ElementRef;

    // pagination
    @ViewChild(MatPaginator, {static: true }) paginator: MatPaginator;

    // Pagination
    length: number;
    pageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    meta: any;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    // Data for the list table display
    dataSource: AccountingDataSource;

    members: any;
    branches: any;
    branchId: any;

    form: FormGroup;

    constructor(private fb: FormBuilder, private service: AccountingService,
                private generalJournalService: GeneralJournalService,
                private notification: NotificationService, private dialog: MatDialog,
                private memberService: NotificationService, private branchService: NotificationService,
                private store: Store<AppState>) {
       // this.store.pipe(select(branch)).subscribe(user => this.branchId = user);
    }

    /**
     * Initialize data lead
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        this.dataSource = new AccountingDataSource(this.service);

        // Load pagination data
        this.dataSource.meta$.subscribe((res) => this.meta = res);

        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.dataSource.load('', 0, 0, 'account_number', 'desc', 'branch_id', this.branchId);

      /*  this.branchService.list(['name'])
            .subscribe((res) => this.branches = res,
                () => this.branches = []
            );*/

        this.form = this.fb.group({
            branch_id: [this.branchId],
            include_members: ['']
        });

    }

    /**
     *
     * @param value
     */
    onBranchChange(value) {
        this.branchId = value;
        this.loadData();
    }

    viewStatement(account: AccountingModel) {

        const id = account.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
       // dialogConfig.data = {id};

        dialogConfig.data = {
            id: id,
            type: 'general'
        };

        const dialogRef = this.dialog.open(StatementComponent, dialogConfig);
    }

    /**
     * Fetch data from data lead
     */
    loadData() {
       // console.log(this.sort.direction);
        this.dataSource.load(
            this.search.nativeElement.value,
            (this.paginator.pageIndex + 1),
            (this.paginator.pageSize),
            this.sort.active,
            this.sort.direction,
            'branch_id',
            this.branchId
        );
    }

    /**
     * Handle search and pagination
     */
    ngAfterViewInit() {

        fromEvent(this.search.nativeElement, 'keyup')
            .pipe(
                debounceTime(1000),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.loadData();
                })
            ).subscribe();

        this.paginator.page.pipe(
            // startWith(null),
            tap(() => this.loadData() )
          //  tap( () => console.log('Page Index: ' + (this.paginator.pageIndex + 1))),
           // tap( () => console.log('Page Size: ' + (this.paginator.pageSize)))
        ).subscribe();

        // reset the paginator after sorting
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                tap(() => this.loadData())
            )
            .subscribe();
    }

    /**
     * Empty search box
     */
    clearSearch() {
        this.search.nativeElement.value = '';
        this.loadData()
    }

    /**
     *
     * @param row
     */
    downloadStatement(row: any) {

        this.loader = true;
        this.service.downloadGeneralAccountStatement({id: row.id, pdf: true})
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
    showFile(blob) {
        const newBlob = new Blob([blob], {type: 'application/pdf'});

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }
        const data = window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = data;
        link.download = 'statement.pdf';
        link.click();
        setTimeout(function() {
            window.URL.revokeObjectURL(data);
        }, 100);
    }

}
