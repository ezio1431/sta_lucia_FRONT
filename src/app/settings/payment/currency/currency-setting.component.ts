import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { AddCurrencyComponent } from './add/add-currency.component';
import {CurrencySettingDataSource} from './data/currency-setting-data.source';
import {CurrencySettingService} from './data/currency-setting.service';
import {CurrencySettingModel} from './model/currency-setting.model';
import {select, Store} from '@ngrx/store';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';
import { AppState } from '../../../reducers';
import { selectorDefaultCurrency } from '../../../authentication/authentication.selectors';

@Component({
    selector: 'robi-currency-general-setting',
    templateUrl: './currency-setting.component.html',
    styleUrls: ['./currency-setting.component.css']
})
export class CurrencySettingComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'country',
        'code',
        'rate',
        'date',
        'for_buying',
        'for_selling',
        'actions',
    ];

    loader = false;

    dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  fetchingLatest = false;

    // Search field
    @ViewChild('search', {static: true}) search: ElementRef;
    // pagination
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    // Pagination
    length: number;
    pageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    meta: any;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    // Data for the list table display
    dataSource: CurrencySettingDataSource;
  baseCurrency$: Observable<string>;
  baseCurrencyCode: string;

    roles: any = [];

    constructor(private service: CurrencySettingService,
                private store: Store<AppState>,
                private dialog: MatDialog) {
    }

    /**
     * Initialize data source
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {
      this.baseCurrency$ = this.store.pipe(select(selectorDefaultCurrency));

      this.store.pipe(select(selectorDefaultCurrency)).subscribe(currency => {
        this.baseCurrencyCode = currency?.code;
      });
        this.dataSource = new CurrencySettingDataSource(this.service);
        // Load pagination data
        this.dataSource.meta$.subscribe((res) => this.meta = res);
        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.dataSource.load('', 0, 0, 'updated_at', 'desc');
    }

    /**
     * @param isAdd
     * @param currency
     */
    addDialog(isAdd = true, currency?: CurrencySettingModel) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {currency, isAdd,
            roles: this.roles,
        };
        dialogConfig.width = '500px';
        dialogConfig.minHeight = '350px';

        const dialogRef = this.dialog.open(AddCurrencyComponent, dialogConfig);

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
     * Empty search box
     */
    clearSearch() {
        this.search.nativeElement.value = '';
        this.loadData();
    }

  latestRates() {
    this.fetchingLatest = true;
    this.service.latest(this.baseCurrencyCode).subscribe(data => {
        this.fetchingLatest = false;
        this.loadData();
      },
      (error) => {
        this.fetchingLatest = false;
      });
  }
}
