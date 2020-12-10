import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';

import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NotificationService } from '../../../shared/notification.service';
import { UtilityEntityService } from './data/utility-entity.service';
import { UtilityModel } from './model/utility-model';
import { AddUtilityComponent } from './add/add-utility.component';
import { UtilityDataSource } from './data/utility-data.source';
import { select, Store } from '@ngrx/store';
import { selectorUtilityPage, utilitySelectors } from './data/ulitity-selectors';

export interface PageQuery {
    pageIndex: number,
    pageSize: number
}

@Component({
    selector: 'robi-utility-setting',
    templateUrl: './utility-setting.component.html',
    styleUrls: ['./utility-setting.component.scss']
})
export class UtilitySettingComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'utility_name',
        'utility_display_name',
        'utility_description',
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

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    utilities$: any;
    isLoaded: boolean;
    dataSource$: any;
    utilitiesDataSource: UtilityDataSource;
    loading$: any;

    meta: any;
    metax: any;


    paginator$: any;

    constructor(private utilityEntityService: UtilityEntityService, private notification: NotificationService,
                private dialog: MatDialog, private store: Store) {
    }

    /**
     * Initialize data source
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        this.utilitiesDataSource = new UtilityDataSource(this.store, null, this.utilityEntityService);

        const initialPage: PageQuery = {
          pageIndex: 0,
          pageSize: 3
        };

        this.utilitiesDataSource.loadUtilities(initialPage);

      /*  console.log('utilitySelectors');
        console.log(utilitySelectors);
      //  console.log(selectorUtilityPage);
        console.log();
        this.store.pipe(select(selectorUtilityPage(initialPage))).subscribe(xxx => console.log(xxx));*/

        // load Utilities
      //  this.loadUtilities();
      //  this.loadData();

      //  this.dataSource$ = this.utilityEntityService.entities$;
        this.loading$ = this.utilityEntityService.loading$;
        this.paginator$ = this.utilityEntityService.selectors$.collection$;

       /* this.utilityEntityService.selectors$.collection$.subscribe(xxx => {


            console.log('mettaaxxx', xxx['meta']);
            this.meta = xxx;
        });
        this.metax = this.meta.meta;*/

    }

    /**
     * Load Property entities either from store or API
     */
    loadUtilities() {
        this.utilityEntityService.loaded$
            .pipe(
                tap(loaded => {
                    this.isLoaded = loaded;
                    if (!loaded) {
                        this.utilityEntityService.getAll();
                    }
                }),
            ).subscribe(data => {
            this.utilities$ = this.utilityEntityService.entities$;
        });
    }

    /**
     * Fetch data from data source
     */
    loadData() {
        this.utilityEntityService.loaded$
            .pipe(
                tap(loaded => {
                    this.isLoaded = loaded;
                    if (!loaded) {
                       // this.utilityEntityService.getWithQuery();


                        this.utilityEntityService.getWithQuery({
                            'filter': '',
                            'page': (this.paginator.pageIndex + 1).toString(),
                            'limit': (this.paginator.pageSize).toString(),
                            'sortField': '',
                            'sortDirection': ''
                        });



                    }
                }),
            ).subscribe(data => {
            this.utilities$ = this.utilityEntityService.entities$;
        });
    }

    xxxload() {
        console.log('load data', (this.paginator.pageIndex + 1).toString());
        const newPage: PageQuery = {
            pageIndex: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize
        };
        this.utilitiesDataSource.loadUtilities(newPage);
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
     * Add dialog launch
     */
    addDialog(mode: string, utility?: UtilityModel) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {utility,
            mode: mode
        };

        const dialogRef = this.dialog.open(AddUtilityComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                     this.xxxload();
                }
            }
        );
    }

    /**
     * Open Edit form
     * @param utility
     */
    openConfirmationDialog(utility: UtilityModel) {

        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true
        });
        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.delete(utility);
            }
            this.dialogRef = null;
        });
    }

    /**
     * Remove resource from db
     * @param utility
     */
    delete(utility: UtilityModel) {
    }

    /**
     * Empty search box
     */
    clearSearch() {
        this.search.nativeElement.value = '';
        this.loadData()
    }
}
