import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../shared/delete/confirmation-dialog-component';
import { AddTenantComponent } from './add/add-tenant.component';
import { TenantModel } from './models/tenant-model';
import { TenantDataSource } from './data/tenant-data.source';
import { TenantService } from './data/tenant.service';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
    selector: 'robi-properties',
    templateUrl: './tenant.component.html',
    styleUrls: ['./tenant.component.scss']
})
export class TenantComponent implements OnInit, AfterViewInit {

    displayedColumns = [
        'first_name',
        'last_name',
        'gender',
        'phone',
        'actions'
    ];

    loader = false;

    dialogRef: MatDialogRef<ConfirmationDialogComponent>;

    dataSource: TenantDataSource;

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
    isAdmin$: Observable<boolean>;
    constructor(private tenantService: TenantService,
                private authenticationService: AuthenticationService,
                private dialog: MatDialog) {
        this.isAdmin$ = this.authenticationService.isAdmin();
    }

    /**
     * Initialize data lead
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {
        this.dataSource = new TenantDataSource(this.tenantService);
        // Load pagination data
        this.dataSource.meta$.subscribe((res) => this.meta = res);
        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.dataSource.load('', 0, 0, 'first_name', 'desc');
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
     * Add dialog launch
     */
    addDialog(mode: string, landlord?: TenantModel) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {landlord,
            mode: mode
        };

        const dialogRef = this.dialog.open(AddTenantComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                   // this.loadData();
                }
            }
        );
    }

    /**
     * @param tenant
     */
    onSelected(tenant: TenantModel): void {
        this.tenantService.changeSelectedTenant(tenant);
    }
}
