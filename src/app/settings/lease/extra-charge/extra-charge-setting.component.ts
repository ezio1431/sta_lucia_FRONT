import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';

import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NotificationService } from '../../../shared/notification.service';
import { ExtraChargeModel } from './model/extra-charge-model';
import { AddExtraChargeComponent } from './add/add-extra-charge.component';
import { ExtraChargeDataSource } from './data/extra-charge-data.source';
import { ExtraChargeService } from './data/extra-charge.service';

@Component({
    selector: 'robi-extra-charge-setting',
    templateUrl: './extra-charge-setting.component.html',
    styleUrls: ['./extra-charge-setting.component.scss']
})
export class ExtraChargeSettingComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'extra_charge_name',
        'extra_charge_display_name',
        'extra_charge_description',
        'actions'
    ];

    loader = false;

    dialogRef: MatDialogRef<ConfirmationDialogComponent>;

    dataSource: ExtraChargeDataSource;

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

    constructor(private extraChargeService: ExtraChargeService,
                private notification: NotificationService,
                private dialog: MatDialog) {
    }

    /**
     * Initialize data source
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {
        this.dataSource = new ExtraChargeDataSource(this.extraChargeService);
        // Load pagination data
        this.dataSource.meta$.subscribe((res) => this.meta = res);
        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.dataSource.load('', 0, 0, 'extra_charge_name', 'desc');
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
            tap(() => this.loadData() )
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
     * Fetch data from data lead
     */
    loadData() {
        this.dataSource.load(
            this.search.nativeElement.value,
            (this.paginator.pageIndex + 1),
            (this.paginator.pageSize),
            this.sort.active,
            this.sort.direction
        );
    }

    /**
     * Empty search box
     */
    clearSearch() {
        this.search.nativeElement.value = '';
        this.loadData()
    }

    /**
     * @param isAdd
     * @param extraCharge
     */
    addDialog(isAdd = true, extraCharge?: ExtraChargeModel) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {extraCharge, isAdd};

        const dialogRef = this.dialog.open(AddExtraChargeComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    this.loadData();
                }
            }
        );
    }

    /**
     * Open Edit form
     * @param extraCharge
     */
    openConfirmationDialog(extraCharge: ExtraChargeModel) {
        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true
        });
        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.delete(extraCharge);
            }
            this.dialogRef = null;
        });
    }

    /**
     * Remove resource from db
     * @param extraCharge
     */
    delete(extraCharge: ExtraChargeModel) {
        this.loader = true;
        this.extraChargeService.delete(extraCharge)
            .subscribe((data) => {
                    this.loader = false;
                    this.loadData();
                    this.notification.showNotification('success', 'Success !! ExtraCharge has been deleted.');
                },
                (error) => {
                    this.loader = false;
                    if (error.error['message']) {
                        this.notification.showNotification('danger', error.error['message']);
                    } else {
                        this.notification.showNotification('danger', 'Delete Error !! ');
                    }
                });
    }
}
