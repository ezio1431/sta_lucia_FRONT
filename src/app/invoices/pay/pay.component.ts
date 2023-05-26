import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { InvoiceModel } from '../models/invoice-model';
import { PaymentMethodService } from '../../settings/payment/payment-method/data/payment-method.service';
import { InvoiceService } from '../data/invoice.service';
import { Subscription } from 'rxjs';
import { PayService } from './data/pay.service';
import { debounceTime, delay, distinctUntilChanged, filter, map, takeUntil, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import {
    IPayPalConfig,
    ICreateOrderRequest
} from 'ngx-paypal';
import { AppState } from '../../reducers';
import { NotificationService } from '../../core/core.module';
import { CurrencySettingService } from '../../settings/payment/currency/data/currency-setting.service';
import { selectorDefaultCurrency } from '../../authentication/authentication.selectors';
import { PaymentTypeModel } from './models/payment-type-model';

@Component({
    selector: 'robi-pay',
    templateUrl: './pay.component.html',
    styleUrls: ['./pay.component.scss']
})

export class PayComponent implements OnInit, OnDestroy, AfterViewInit {
    form: FormGroup;
    formErrors: any;
    private errorInForm = new BehaviorSubject<boolean>(false);
    formError$ = this.errorInForm.asObservable();
    paymentMethods$: any = [];

    invoice: InvoiceModel;
    clientID: string;
    public loader = false;

    @ViewChild('cardInfo', {static: false}) cardInfo: ElementRef;
    stripe;
    loading = false;
    confirmation;
    clSecret: string = null;

    card: any;
    cardHandler = this.onChange.bind(this);
    error: string;
    amountDue: any;

    isStripe$: Observable<boolean> = of(false);
    isCash$: Observable<boolean> = of(false);
    isPayPal$: Observable<boolean> = of(false);
    isMpesa$: Observable<boolean> = of(false);
    isBankWire$: Observable<boolean> = of(false);
    bankWireDetails$: Observable<string> = of('');
    payAmount$: Observable<string>;

    public payPalConfig ?: IPayPalConfig;

    public searching = false;
    public currencyServerSideFilteringCtrl: FormControl = new FormControl();
    public filteredServerSideCurrencies: ReplaySubject<any> = new ReplaySubject<any>(1);
    currenciesFiltered$: Observable<any>;
    protected _onDestroy = new Subject<void>();
    selectedCurrencySub = new Subscription();
    currencySymbol: string;
    defaultCurrency: any;
    formError: any;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private cd: ChangeDetectorRef,
                private payService: PayService,
                private store: Store<AppState>,
                private fb: FormBuilder,
                private dialog: MatDialog,
                private currencyService: CurrencySettingService,
                private invoiceService: InvoiceService,
                private paymentMethodsService: PaymentMethodService,
                private translateService: TranslateService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<PayComponent>) {
        this.invoice = row.invoice;
        this.clientID = row.clientID;
        this.paymentMethods$ = this.paymentMethodsService.listForTenant(['type', 'display_name', 'payment_method_description', 'charges']);
        this.payAmount$ = of(this.invoice?.summary?.amount_due);
        this.amountDue = this.invoice?.summary?.amount_due_number;

        this.store.pipe(select(selectorDefaultCurrency)).subscribe(currency => this.defaultCurrency = currency);
        this.currenciesFiltered$ = of([this.defaultCurrency]);
    }

    ngOnInit() {
        this.form = this.fb.group({
            payment_method: ['', [Validators.required]],
            currency: [this.defaultCurrency, [Validators.required]],
            amount: [this.invoice?.summary?.amount_due_number, [Validators.required]]
        });

        // currency Server Side search
        this.currencyServerSideFilteringCtrl.valueChanges
            .pipe(
                filter(search => !!search),
                tap(() => this.searching = true),
                takeUntil(this._onDestroy),
                debounceTime(200),
                distinctUntilChanged(),
                map(search => {
                    search = search.toLowerCase();
                    this.currenciesFiltered$ = this.currencyService.search(search);
                }),
                delay(500)
            )
            .subscribe(filteredCurrencies => {
                    this.searching = false;
                    this.filteredServerSideCurrencies.next(filteredCurrencies);
                },
                error => {
                    this.searching = false;
                });

        // PayPal
        this.initConfig();
    }

    getCurrencyCode() {
        return this.form.get('currency').value?.code;
    }

    getAmount() {
        return this.form.get('amount').value;
    }

    close() {
        this.dialogRef.close();
    }

    onPaymentMethodItemChange(value: PaymentTypeModel) {
        this.currenciesFiltered$ = of([this.defaultCurrency]);
        this.form.patchValue({currency: this.defaultCurrency});
        this.form.controls['currency'].enable();

        this.isStripe$ = of(value.type === 'stripe');
        this.isCash$ = of(value.type === 'cash');
        this.isPayPal$ = of(value.type === 'paypal');
        this.isMpesa$ = of(value.type === 'mpesa');
        this.isBankWire$ = of(value.type === 'bank_wire');

        this.calculateAmountDue(value);
        if (value.type === 'bank_wire') {
            this.bankWireDetails$ = of(value.payment_method_description);
        }
        if (value.type === 'mpesa') {
            this.currencyService.search('kenya').subscribe((currencyData) => {
                this.currenciesFiltered$ = of(currencyData);
                this.form.patchValue({currency: currencyData[0]});
                this.form.controls['currency'].disable();
            });
        }
    }

    calculateAmountDue(paymentType: PaymentTypeModel) {
        const invoiceDue: number = this.invoice?.summary?.amount_due_number;
        const percentageCharge = paymentType?.charges?.percent_charge;
        const fixedCharge = paymentType?.charges?.fixed_charge;

        let charge = 0;
        if (percentageCharge > 0) {
            charge = (percentageCharge / 100 ) * invoiceDue + fixedCharge;
        }
        const amountDue = charge + invoiceDue;

        this.form.patchValue({
            amount: amountDue
        });
    }

    amountValueChange(event) {
        this.payAmount$ = of(event?.target?.value);
    }

    ngAfterViewInit() {
    }


    onChange({error}) {
        if (error) {
            this.error = error.message;
        } else {
            this.error = null;
        }
        this.cd.detectChanges();
    }

    async onSubmit(form: NgForm) {
        const {token, error} = await this.stripe.createToken(this.card);

        if (error) {
        } else {
            await this.onClickStripe(form);
        }
    }

    onClickStripe(form: NgForm) {
    }

    ngOnDestroy() {
        //  this.card.removeEventListener('change', this.cardHandler);
        // this.card.destroy();
    }

    private initConfig(): void {
        this.payPalConfig = {
            currency: this.getCurrencyCode(),
            // clientId: 'Af4PZ7rHRt743Xr2nos5NWkOcZ2OQpOuRu3Swt_ve7FatwfTibltuNUiiMfyH7I_ZiTtDhcxNHzTTtOe',
            clientId: this.clientID,
            createOrderOnClient: (data) => <ICreateOrderRequest>{
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: this.getCurrencyCode(),
                        value: this.getAmount(),
                        breakdown: {
                            item_total: {
                                currency_code: this.getCurrencyCode(),
                                value: this.getAmount()
                            }
                        }
                    },
                    custom_id: this.invoice?.id
                }]
            },
            advanced: {
                commit: 'true'
            },
            style: {
                label: 'paypal',
                layout: 'vertical'
            },
            onApprove: (data, actions) => {
                this.loader = true;
                actions.order.get().then(details => {
                });
            },
            onClientAuthorization: (data) => {
                this.payService.payPalPaymentClientAuthorized(data).subscribe(res => {
                    this.dialogRef.close(res);
                    this.loader = false;
                });
            },
            onCancel: (data, actions) => {
                this.payService.payPalPaymentError(data).subscribe(res => {
                    this.notification.info(res?.message);
                });
            },
            onError: err => {
                this.errorInForm.next(true);
                this.formError = err;
            },
            onClick: (data, actions) => {
            }
        };
    }

    onCurrencyItemChange(value: any) {
    }
}
