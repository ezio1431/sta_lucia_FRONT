import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';

import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NotificationService } from '../../../shared/notification.service';
import { UnitTypeEntityService } from './data/unit-type-entity.service';
import { UnitTypeModel } from './model/unit-type-model';
import { AddUnitTypeComponent } from './add/add-unit-type.component';

@Component({
    selector: 'robi-unit-type-setting',
    templateUrl: './unit-type-setting.component.html',
    styleUrls: ['./unit-type-setting.component.scss']
})
export class UnitTypeSettingComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'unit_type_name',
        'unit_type_display_name',
        'unit_type_description',
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

    constructor(private unitTypeEntityService: UnitTypeEntityService, private notification: NotificationService,
                private dialog: MatDialog) {
    }

    /**
     * Initialize data source
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        // load Utilities
        this.loadUnitTypes();

        this.dataSource$ = this.unitTypeEntityService.entities$;

        /*this.unitTypeEntityService.selectors$.collection$.subscribe(xxx => {
            this.meta = xxx;
        });
        this.metax = this.meta.meta;*/

    }

    /**
     * Load Property entities either from store or API
     */
    loadUnitTypes() {
        this.unitTypeEntityService.loaded$
            .pipe(
                tap(loaded => {
                    this.isLoaded = loaded;
                    if (!loaded) {
                        this.unitTypeEntityService.getAll();
                    }
                }),
            ).subscribe(data => {
            this.utilities$ = this.unitTypeEntityService.entities$;
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
    addDialog(mode: string, unitType?: UnitTypeModel) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {unitType,
            mode: mode
        };

        const dialogRef = this.dialog.open(AddUnitTypeComponent, dialogConfig);
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
     * @param unitType
     */
    openConfirmationDialog(unitType: UnitTypeModel) {

        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true
        });
        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.delete(unitType);
            }
            this.dialogRef = null;
        });
    }

    /**
     * Remove resource from db
     * @param unitType
     */
    delete(unitType: UnitTypeModel) {
    }

    /**
     * Empty search box
     */
    clearSearch() {
        this.search.nativeElement.value = '';
        this.loadData()
    }
}
