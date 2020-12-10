import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';

import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { RoleSettingDataSource } from '../data/role-setting-data.source';
import { AddAmenityComponent } from './add/add-amenity.component';
import { RoleSettingModel } from '../model/role-setting-model';
import { EditAmenityComponent } from './edit/edit-amenity.component';
import { CheckboxItem } from './edit/check-box-item';
import { RoleSettingService } from '../data/role-setting.service';
import { NotificationService } from '../../../shared/notification.service';
import { PermissionSettingService } from '../data/permission-setting.service';
import { select, Store } from '@ngrx/store';
import { selectAllAmenities } from './store/amenities.selectors';
import { AmenityDataSource } from './data/amenity-data.source';
import { AmenityEntityService } from './data/amenity-entity.service';
import { PageQuery } from '../utility/utility-setting.component';

@Component({
    selector: 'robi-utility-setting',
    templateUrl: './amenity-setting.component.html',
    styleUrls: ['./amenity-setting.component.css']
})
export class AmenitySettingComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'amenity_name',
        'amenity_display_name',
        'amenity_description',
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
    pageSizeOptions: number[] = [3, 5, 10, 25, 50, 100];
    meta: any;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    // Data for the list table display
    dataSource: RoleSettingDataSource;

    allPermissions: any;
    allPermissionsOptions = new Array<CheckboxItem>();

    rolePermissions: any;

    amenities$: any;

    amenitiesDataSource: AmenityDataSource;

    constructor(private roleService: RoleSettingService, private permissionService: PermissionSettingService,
                private notification: NotificationService, private dialog: MatDialog,
                private store: Store, private amenityEntityService: AmenityEntityService) {
    }

    /**
     * Initialize data source
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        this.amenitiesDataSource = new AmenityDataSource(this.store, null, this.amenityEntityService);
        // Load pagination data
        this.amenitiesDataSource.meta$.subscribe((res) => this.meta = res);

        const initialPage: PageQuery = {
            pageIndex: 0,
            pageSize: 3
        };
        this.amenitiesDataSource.loadAmenities(initialPage);

        console.log('this.amenitiesDataSource');
        console.log(this.amenitiesDataSource);

        this.amenities$ = this.store.pipe(select(selectAllAmenities));

      //  this.dataSource = new RoleSettingDataSource(this.roleService);

        // Load pagination data
    //    this.dataSource.meta$.subscribe((res) => this.meta = res);

        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
    //    this.dataSource.load('', 0, 0, 'updated_at', 'desc');

        // Fetch all permissions
     /*   this.permissionService.list(['name', 'display_name'])
            .subscribe((res) => {
                    this.allPermissions = res;
                    this.allPermissionsOptions = this.allPermissions.map(
                        x => new CheckboxItem(x.id, x.display_name));
                },
                () => this.allPermissions = []
            );
*/
    }

    xxxload() {
        console.log('load data', (this.paginator.pageIndex + 1).toString());
        const newPage: PageQuery = {
            pageIndex: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize
        };
        this.amenitiesDataSource.loadAmenities(newPage);
    }

    /**
     * Add dialog launch
     */
    addDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        const dialogRef = this.dialog.open(AddAmenityComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    this.loadData();
                }
            }
        );
    }

    /**
     * Edit dialog launch
     */
    editDialog(role: RoleSettingModel) {

        const id = role.id;

        const data = {
            role,
            permOptions: this.allPermissionsOptions
        };

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {role,
            permOptions: this.allPermissionsOptions};

        const dialogRef = this.dialog.open(EditAmenityComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    this.loadData();
                }
            }
        );
    }

    /**
     * Fetch data from data source
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
     * Handle search and pagination
     */
    ngAfterViewInit() {

        console.log('gikure ... ngAfterViewInit');
        /*fromEvent(this.search.nativeElement, 'keyup')
            .pipe(
                debounceTime(1000),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.loadData();
                })
            ).subscribe();*/

        this.paginator.page.pipe(
            tap(() => this.xxxload() )
        ).subscribe();

        // reset the paginator after sorting
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                tap(() => this.xxxload())
            )
            .subscribe();
    }

    /**
     * Open Edit form
     * @param role
     */
    openConfirmationDialog(role: RoleSettingModel) {

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
    delete(role: RoleSettingModel) {
        this.loader = true;
        this.roleService.delete(role)
            .subscribe((data) => {
                    this.loader = false;
                    this.loadData();
                    this.notification.showNotification('success', 'Success !! Role has been deleted.');
                },
                (error) => {
                    this.loader = false;
                    if (!error.error['error']) {
                        this.notification.showNotification('danger', 'Connection Error !! Nothing deleted.' +
                            ' Check Connection and retry. ');
                    } else {
                        this.notification.showNotification('danger', 'Delete Error !! ');
                    }
                });
    }

    /**
     * Empty search box
     */
    clearSearch() {
        this.search.nativeElement.value = '';
        this.loadData()
    }
}
