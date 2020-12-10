import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';

import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NotificationService } from '../../../shared/notification.service';
import { LeaseModeEntityService } from './data/lease-mode-entity.service';
import { LeaseModeModel } from './model/lease-mode-model';
import { AddLeaseModeComponent } from './add/add-lease-mode.component';

@Component({
    selector: 'robi-lease-mode-setting',
    templateUrl: './lease-mode-setting.component.html',
    styleUrls: ['./lease-mode-setting.component.scss']
})
export class LeaseModeSettingComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'lease_mode_name',
        'lease_mode_display_name',
        'lease_mode_description',
        'actions'
    ];

    loader = false;

    dialogRef: MatDialogRef<ConfirmationDialogComponent>;

    // Search field
    @ViewChild('search', {static: true}) search: ElementRef;
    // pagination
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    // Pagination
    length: number;
    pageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    utilities$: any;
    isLoaded: boolean;
    dataSource$: any;
    meta: any;
    metax: any;

    constructor(private leaseModeEntityService: LeaseModeEntityService, private notification: NotificationService,
                private dialog: MatDialog) {
    }

    /**
     * Initialize data source
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        // load Utilities
        this.loadUtilities();

        this.dataSource$ = this.leaseModeEntityService.entities$;

        /*this.leaseModeEntityService.selectors$.collection$.subscribe(xxx => {
            this.meta = xxx;
        });
        this.metax = this.meta.meta;*/

    }

    /**
     * Load Property entities either from store or API
     */
    loadUtilities() {
        this.leaseModeEntityService.loaded$
            .pipe(
                tap(loaded => {
                    this.isLoaded = loaded;
                    if (!loaded) {
                        this.leaseModeEntityService.getAll();
                    }
                }),
            ).subscribe(data => {
            this.utilities$ = this.leaseModeEntityService.entities$;
        });
    }

    /**
     * Fetch data from data source
     */
    loadData() {
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
     * Add dialog launch
     */
    addDialog(mode: string, leaseMode?: LeaseModeModel) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {leaseMode,
            mode: mode
        };

        const dialogRef = this.dialog.open(AddLeaseModeComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    // this.loadData();
                }
            }
        );
    }

    /**
     * Open Edit form
     * @param leaseMode
     */
    openConfirmationDialog(leaseMode: LeaseModeModel) {

        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true
        });
        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.delete(leaseMode);
            }
            this.dialogRef = null;
        });
    }

    /**
     * Remove resource from db
     * @param leaseMode
     */
    delete(leaseMode: LeaseModeModel) {
    }

    /**
     * Empty search box
     */
    clearSearch() {
        this.search.nativeElement.value = '';
        this.loadData()
    }
}
