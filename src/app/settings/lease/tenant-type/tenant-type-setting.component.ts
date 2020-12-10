import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';

import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NotificationService } from '../../../shared/notification.service';
import { TenantTypeEntityService } from './data/tenant-type-entity.service';
import { TenantTypeModel } from './model/tenant-type-model';
import { AddTenantTypeComponent } from './add/add-tenant-type.component';

@Component({
    selector: 'robi-tenant-type-setting',
    templateUrl: './tenant-type-setting.component.html',
    styleUrls: ['./tenant-type-setting.component.scss']
})
export class TenantTypeSettingComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'tenant_type_name',
        'tenant_type_display_name',
        'tenant_type_description',
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

    constructor(private tenantTypeEntityService: TenantTypeEntityService, private notification: NotificationService,
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

        this.dataSource$ = this.tenantTypeEntityService.entities$;

        /*this.tenantTypeEntityService.selectors$.collection$.subscribe(xxx => {
            this.meta = xxx;
        });
        this.metax = this.meta.meta;*/

    }

    /**
     * Load Property entities either from store or API
     */
    loadUtilities() {
        this.tenantTypeEntityService.loaded$
            .pipe(
                tap(loaded => {
                    this.isLoaded = loaded;
                    if (!loaded) {
                        this.tenantTypeEntityService.getAll();
                    }
                }),
            ).subscribe(data => {
            this.utilities$ = this.tenantTypeEntityService.entities$;
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
    addDialog(mode: string, tenantType?: TenantTypeModel) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {tenantType,
            mode: mode
        };

        const dialogRef = this.dialog.open(AddTenantTypeComponent, dialogConfig);
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
     * @param role
     */
    openConfirmationDialog(role: TenantTypeModel) {

        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true
        });
        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.delete(role);
            }
            this.dialogRef = null;
        });
    }

    /**
     * Remove resource from db
     * @param role
     */
    delete(role: TenantTypeModel) {
    }

    /**
     * Empty search box
     */
    clearSearch() {
        this.search.nativeElement.value = '';
        this.loadData()
    }
}
