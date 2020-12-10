import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';

import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NotificationService } from '../../../shared/notification.service';
import { PaymentMethodEntityService } from './data/payment-method-entity.service';
import { PaymentMethodModel } from './model/payment-method-model';
import { AddPaymentMethodComponent } from './add/add-payment-method.component';

@Component({
    selector: 'robi-payment-method-setting',
    templateUrl: './payment-method-setting.component.html',
    styleUrls: ['./payment-method-setting.component.scss']
})
export class PaymentMethodSettingComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'payment_method_name',
        'payment_method_display_name',
        'payment_method_description',
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

    constructor(private paymentMethodEntityService: PaymentMethodEntityService, private notification: NotificationService,
                private dialog: MatDialog) {
    }

    /**
     * Initialize data source
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        // load PaymentMethods
        this.loadPaymentMethods();

        this.dataSource$ = this.paymentMethodEntityService.entities$;

        /*this.paymentMethodEntityService.selectors$.collection$.subscribe(xxx => {
            this.meta = xxx;
        });
        this.metax = this.meta.meta;*/

    }

    /**
     * Load Property entities either from store or API
     */
    loadPaymentMethods() {
        this.paymentMethodEntityService.loaded$
            .pipe(
                tap(loaded => {
                    this.isLoaded = loaded;
                    if (!loaded) {
                        this.paymentMethodEntityService.getAll();
                    }
                }),
            ).subscribe(data => {
            this.utilities$ = this.paymentMethodEntityService.entities$;
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
    addDialog(mode: string, paymentMethod?: PaymentMethodModel) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {paymentMethod,
            mode: mode
        };

        const dialogRef = this.dialog.open(AddPaymentMethodComponent, dialogConfig);
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
     * @param paymentMethod
     */
    openConfirmationDialog(paymentMethod: PaymentMethodModel) {

        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true
        });
        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.delete(paymentMethod);
            }
            this.dialogRef = null;
        });
    }

    /**
     * Remove resource from db
     * @param paymentMethod
     */
    delete(paymentMethod: PaymentMethodModel) {
    }

    /**
     * Empty search box
     */
    clearSearch() {
        this.search.nativeElement.value = '';
        this.loadData()
    }
}
