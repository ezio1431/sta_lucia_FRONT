import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../../shared/notification.service';
import { BehaviorSubject } from 'rxjs';
import { PaymentMethodModel } from '../model/payment-method-model';
import { PaymentMethodService } from '../data/payment-method.service';
import { TranslateService } from '@ngx-translate/core';
import { PAYMENT_METHOD_TYPES } from '../../../../shared/enums/payment-method-type-enum';

@Component({
    selector: 'robi-add-payment-method',
    styles: [],
    templateUrl: './add-payment-method.component.html'
})

export class AddPaymentMethodComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;
    private errorInForm = new BehaviorSubject<boolean>(false);
    formError$ = this.errorInForm.asObservable();

    paymentMethod: PaymentMethodModel;

    loader = false;

    roles: any = [];
    employees: any = [];
    branches: any = [];
    isAdd: boolean;
    isCash = false;
    isPayPal = false;
    isStripe = false;
    isMpesa = false;
    isBankWire = false;
    isOther = false;
    paymentMethodTypes: any;
    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private paymentMethodService: PaymentMethodService,
                private notification: NotificationService,
                private translateService: TranslateService,
                private dialogRef: MatDialogRef<AddPaymentMethodComponent>) {
        this.roles = row.roles;
        this.employees = row.employees;
        this.branches = row.branches;
        this.isAdd = row.isAdd;
        this.paymentMethod = row.paymentMethod;
        this.paymentMethodTypes = PAYMENT_METHOD_TYPES;
    }

    ngOnInit() {
        if (this.isAdd) {
            this.form = this.fb.group({
                type: ['', [Validators.required]],
                display_name: ['', [Validators.required]],
                paypal_fields: this.fb.group({
                    client_id: [''],
                    secret_key: [''],
                    live_status: ['sandbox']
                }),
                stripe_fields: this.fb.group({
                    public_key: [''],
                    secret_key: ['']
                }),
                mpesa_fields: this.fb.group({
                    short_code: [''],
                    consumer_key: [''],
                    consumer_secret: [''],
                    initiator_username: [''],
                    security_credential: [''],
                    account_number_match: ['lease_number']
                }),
                charge_fields: this.fb.group({
                    percent_charge: [''],
                    fixed_charge: ['']
                }),
                payment_method_description: ['', [Validators.required,
                    Validators.minLength(3)]],
            });
        }
        if (!this.isAdd) {
            const type = this.paymentMethod?.type;
            this.isCash = type === 'cash';
            this.isPayPal = type === 'paypal';
            this.isBankWire = type === 'bank_wire';
            this.isStripe = type === 'stripe';
            this.isMpesa = type === 'mpesa';

            this.form = this.fb.group({
                type: [this.paymentMethod?.type, [Validators.required]],
                display_name: [this.paymentMethod?.display_name, [Validators.required]],
                payment_method_description: [this.paymentMethod?.payment_method_description],
                paypal_fields: this.fb.group({
                    client_id: [this.paymentMethod?.details?.client_id],
                    secret_key: [this.paymentMethod?.details?.secret_key],
                    live_status: [this.paymentMethod?.details?.live_status]
                }),
                stripe_fields: this.fb.group({
                    public_key: [this.paymentMethod?.details?.public_key],
                    secret_key: [this.paymentMethod?.details?.secret_key]
                }),
                mpesa_fields: this.fb.group({
                    short_code: [this.paymentMethod?.details?.short_code],
                    consumer_key: [this.paymentMethod?.details?.consumer_key],
                    consumer_secret: [this.paymentMethod?.details?.consumer_secret],
                    initiator_username: [this.paymentMethod?.details?.initiator_username],
                    security_credential: [this.paymentMethod?.details?.security_credential],
                    account_number_match: [this.paymentMethod?.details?.account_number_match]
                }),
                charge_fields: this.fb.group({
                    percent_charge: [this.paymentMethod?.charges?.percent_charge],
                    fixed_charge: [this.paymentMethod?.charges?.fixed_charge],
                }),
            });
        }
    }

    /**
     * @param value
     */
    onPaymentMethodTypeChange(value) {
        const methodType = this.paymentMethodTypes.find((item: any) => item?.key === value)?.value;
        this.isCash = methodType === 'cash';
        this.isPayPal = methodType === 'paypal';
        this.isStripe = methodType === 'stripe';
        this.isMpesa = methodType === 'mpesa';
        this.isBankWire = methodType === 'bank_wire';
        this.isOther = methodType === 'other';
        if (this.isCash) {
            this.form.patchValue({
                display_name: 'Cash'
            });
        }
        if (this.isStripe) {
            this.form.patchValue({
                display_name: 'Stripe'
            });
        }
        if (this.isPayPal) {
            this.form.patchValue({
                display_name: 'PayPal'
            });
        }
        if (this.isMpesa) {
            this.form.patchValue({
                display_name: 'Mpesa'
            });
        }
        if (this.isBankWire) {
            this.form.patchValue({
                display_name: 'BankWire'
            });
        }
        if (this.isOther) {
            this.form.patchValue({
                display_name: ''
            });
        }
    }

    /**
     * Create member
     */
    create() {
        this.errorInForm.next(false);

        const body = Object.assign({}, this.paymentMethod, this.form.value);

        this.loader = true;

        this.paymentMethodService.create(body).subscribe((data) => {
                this.onSaveComplete();
                this.notification.showNotification('success',
                    this.translateService.instant('settings.payments.method.notification.created'));
            },
            (error) => {
                this.loader = false;
                this.errorInForm.next(true);
                this.formErrors = error;
                if (this.formErrors) {
                    for (const prop in this.formErrors) {
                        if (this.form) {
                            this.form.controls[prop]?.markAsTouched();
                            this.form.controls[prop]?.setErrors({incorrect: true});
                        }
                    }
                }
            });
    }

    /**
     *
     */
    update() {
        const body = Object.assign({}, this.paymentMethod, this.form.value);

        this.loader = true;
        this.errorInForm.next(false);

        this.paymentMethodService.update(body).subscribe((data) => {
                this.loader = false;
                this.dialogRef.close(this.form.value);
                // notify success
                this.notification.showNotification('success',
                    this.translateService.instant('settings.payments.method.notification.updated'));
            },
            (error) => {
                this.loader = false;
                this.errorInForm.next(true);
                this.formErrors = error;
                if (this.formErrors) {
                    for (const prop in this.formErrors) {
                        if (this.form) {
                            this.form.controls[prop]?.markAsTouched();
                            this.form.controls[prop]?.setErrors({incorrect: true});
                        }
                    }
                }
            });
    }

    /**
     * Create or Update Data
     */
    createOrUpdate() {
        this.isAdd ? this.create() : this.update();
    }

    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }

    /**
     *
     */
    public onSaveComplete(): void {
        this.loader = false;
        this.form.reset();
        this.dialogRef.close(this.form.value);
    }
}
