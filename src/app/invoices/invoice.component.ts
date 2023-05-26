import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../shared/delete/confirmation-dialog-component';
import { AddInvoiceComponent } from './add/add-invoice.component';
import { InvoiceModel } from './models/invoice-model';
import { InvoiceDataSource } from './data/invoice-data.source';
import { NotificationService } from '../shared/notification.service';
import { InvoiceService } from './data/invoice.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { LandlordService } from '../landlords/data/landlord.service';
import { selectorIsAgent, selectorIsLandlord, selectorUserID } from '../authentication/authentication.selectors';
import { UserSettingService } from '../settings/user/data/user-setting.service';
import { TenantService } from '../tenants/data/tenant.service';
import { USER_SCOPES } from '../shared/enums/user-scopes.enum';
import { AuthenticationService } from '../authentication/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { PayComponent } from './pay/pay.component';
import { PaymentMethodService } from '../settings/payment/payment-method/data/payment-method.service';

@Component({
    selector: 'robi-utility-bills',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit, AfterViewInit {

    displayedColumns = [
        'invoice_number',
        'invoice_date',
        'lease_id',
        'period',
        'invoice_amount',
        'amount_paid',
        'amount_due',
        'due_date',
        'status',
        'actions'
    ];

    loader = false;

    dialogRef: MatDialogRef<ConfirmationDialogComponent>;

    dataSource: InvoiceDataSource;

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
    isAgent$: Observable<any>;
    isLandlord = false;
    landlordID: string;
    activeUser: any;
    clientID: any;
    isAdmin$: Observable<boolean>;
    constructor(private store: Store<AppState>,
                private userService: UserSettingService,
                private landlordService: LandlordService,
                private tenantService: TenantService,
                private invoiceService: InvoiceService,
                private utilityBillService: InvoiceService,
                private paymentMethodsService: PaymentMethodService,
                private translateService: TranslateService,
                private notification: NotificationService,
                private authenticationService: AuthenticationService,
                private dialog: MatDialog) {
        this.activeUser = this.userService.getActiveUser();
        this.isAgent$ = this.store.pipe(select(selectorIsAgent));
        this.isAdmin$ = this.authenticationService.isAdmin();
        this.store.pipe(select(selectorIsLandlord)).subscribe(isLandlord => {
            if (isLandlord) {
                this.isLandlord = true;
                this.store.pipe(select(selectorUserID)).subscribe(userID => this.landlordID = userID);
            }
        });
    }

    /**
     * Initialize data lead
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {
        this.dataSource = new InvoiceDataSource(this.invoiceService);
        this.dataSource.meta$.subscribe((res) => this.meta = res);

        // load invoices
        switch (this.activeUser?.userType) {
            case USER_SCOPES.ADMIN: {
                this.dataSource.load('', 0, 0, 'updated_at', 'desc');
                break;
            }
            case USER_SCOPES.LANDLORD: {
                this.dataSource.loadNested(
                    this.landlordService.nestedInvoicesUrl(this.activeUser?.userID),
                    '', 0, 0);
                break;
            }
            case USER_SCOPES.TENANT: {
                this.dataSource.loadNested(
                    this.tenantService.nestedInvoicesUrl(this.activeUser?.userID),
                    '', 0, 0);
                break;
            }
        }
        this.getClientID();
    }

    getClientID() {
      this.paymentMethodsService.getPayPalClientID().subscribe((id: string) => this.clientID = id);
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
        switch (this.activeUser?.userType) {
            case USER_SCOPES.ADMIN: {
                this.dataSource.load(
                    this.search.nativeElement.value,
                    (this.paginator.pageIndex + 1),
                    (this.paginator.pageSize),
                    this.sort.active,
                    this.sort.direction
                );
                break;
            }
            case USER_SCOPES.LANDLORD: {
                this.dataSource.loadNested(
                    this.landlordService.nestedInvoicesUrl(this.activeUser?.userID),
                    this.search.nativeElement.value,
                    (this.paginator.pageIndex + 1),
                    (this.paginator.pageSize),
                    this.sort.active,
                    this.sort.direction
                );
                break;
            }
            case USER_SCOPES.TENANT: {
                this.dataSource.loadNested(
                    this.tenantService.nestedInvoicesUrl(this.activeUser?.userID),
                    this.search.nativeElement.value,
                    (this.paginator.pageIndex + 1),
                    (this.paginator.pageSize),
                    this.sort.active,
                    this.sort.direction
                );
                break;
            }
        }
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
    addDialog(mode: string, landlord?: InvoiceModel) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {landlord,
            mode: mode
        };

        const dialogRef = this.dialog.open(AddInvoiceComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                   // this.loadData();
                }
            }
        );
    }

    onSelected(invoice: InvoiceModel): void {
       // this.selectedRowIndex = invoice.id;
        this.invoiceService.changeSelectedInvoice(invoice);
    }

    /**
     *
     * @param row
     */
    downloadStatement(row: any) {
        this.loader = true;
        this.invoiceService.downloadInvoice({id: row.id, pdf: true})
            .subscribe((res) => {
                    this.loader = false;
                    this.showFile(res);
                },
                () => {
                    this.loader = false;
                    this.notification.showNotification('danger',
                        this.translateService.instant('invoices.notifications.download_error'));
                }
            );
    }

    /**
     * Display displayed file
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
        link.download = 'invoice.pdf';
        link.click();
        setTimeout(function() {
            window.URL.revokeObjectURL(data);
        }, 100);
    }

    addPayment(invoice: InvoiceModel) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {invoice,  clientID: this.clientID};
        dialogConfig.width = '500px';
        dialogConfig.minHeight = '200px';
        const dialogRef = this.dialog.open(PayComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    if (!val.error) {
                        this.notification.showNotification('success',
                            this.translateService.instant('Payment Successful. Thank you.'));
                    }
                    console.log(val);
                    this.loadData();
                }
            }
        );
    }
}
