import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityBillModel } from '../models/utility-bill-model';
import { UtilityBillService } from '../data/utility-bill.service';

import { NotificationService } from '../../shared/notification.service';
import { UtilityBillEntityService } from '../data/utility-bill-entity.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UtilityBillUnitDetailsComponent } from './unit-details/utility-bill-unit-details.component';
import { tap } from 'rxjs/operators';
import { TypeEntityService } from '../../settings/property/type/data/type-entity.service';
import { UtilityEntityService } from '../../settings/property/utility/data/utility-entity.service';
import { AmenityEntityService } from '../../settings/property/amenity/data/amenity-entity.service';
import { CheckboxItem } from '../../settings/property/roles/edit/check-box-item';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { TenantTypeEntityService } from '../../settings/lease/tenant-type/data/tenant-type-entity.service';
import { LeaseModeEntityService } from '../../settings/lease/lease-mode/data/lease-mode-entity.service';
import { LeaseTypeEntityService } from '../../settings/lease/lease-type/data/lease-type-entity.service';
import { PaymentFrequencyEntityService } from '../../settings/payment/payment-frequency/data/payment-frequency-entity.service';
import { TenantEntityService } from '../../tenants/data/tenant-entity.service';

@Component({
    selector: 'robi-add-tenant',
    styles: [],
    templateUrl: './add-utility-bill.component.html'
})
export class AddUtilityBillComponent implements OnInit  {

    unitFields: FormArray;
    utilityDeposits: FormArray;

    unitUtilityBills: FormArray;
    unitUtilityBillValues = [];

    unitValues = [];

    tenantFields: FormArray;
    tenantValues = [];

    formErrors: any;
    // formError$: Observable<boolean>;

    private errorInForm = new BehaviorSubject<boolean>(false);
    formError$ = this.errorInForm.asObservable();

    member: UtilityBillModel;

    loader = false;

    memberMethods: any = [];
    groups: any = [];

    formGroup: FormGroup;

    memberStatuses: any = [];
    memberSources: any = [];
    memberTypes: any = [];

    profilePicFileToUpload: File = null;
    membershipFormFileToUpload: File = null;
    profilePicUrl = '';

    membershipFormToUpload: File = null;
    membershipFormUrl = '';

    urls = new Array<string>();

    tenant: UtilityBillModel;

    @ViewChild('stepper', {static: true }) stepper: MatStepper;


    isLinear = false;
    utilitySummaryFormGroup: FormGroup;
    manualUtilityBillsFormGroup: FormGroup;
    entryChoiceFormGroup: FormGroup;
    autoDataEntryFormGroup: FormGroup;

    depositsFormGroup: FormGroup;
    tenantsFormGroup: FormGroup;
    leaseDetailsFormGroup: FormGroup;
    leaseSettingsFormGroup: FormGroup;

    details = 'noooone';

    isLoaded: boolean;

    propertyTypes$: Observable<any>;
    tenantTypes$: Observable<any>;
    leaseModes$: Observable<any>;
    leaseTypes$: Observable<any>;
    paymentFrequencies$: Observable<any>;

    tenants$: Observable<any>;
    utilities$: Observable<any>;
    amenities$: Observable<any>;

    allAmenitiesOptions = new Array<CheckboxItem>();
    allUtilitiesOptions = new Array<CheckboxItem>();
    amenities: any;
    utilities: any;

    logoToUpload: File = null;
    logoUrl = '';
    showLogo: any;

    photoToUpload: File = null;
    photoName: any;
    photoUrl = '';
    showPhoto: any;
    progress = 0;

    public entryType: string;

    constructor(private fb: FormBuilder,
                private dialog: MatDialog,
                private _formBuilder: FormBuilder,
                private propertyService: UtilityBillService,
                private utilityBillEntityService: UtilityBillEntityService,
                private notification: NotificationService,
                private propertyTypeEntityService: TypeEntityService,
                private tenantTypeEntityService: TenantTypeEntityService,
                private leaseModeEntityService: LeaseModeEntityService,
                private leaseTypeEntityService: LeaseTypeEntityService,
                private utilityEntityService: UtilityEntityService,
                private paymentFrequencyEntityService: PaymentFrequencyEntityService,
                private tenantEntityService: TenantEntityService,
                private amenityEntityService: AmenityEntityService) {
        this.entryType = 'manual';
    }

    ngOnInit() {

        this.loadTenants();
        this.loadPropertyTypes();

      //  this.loadPropertyTypes();
        this.loadLeaseTypes();
        this.loadLeaseModes();
        this.loadUtilities();
        this.loadTenantTypes();
        this.loadPaymentFrequencies();

       // this.loadUtilities ();
      //  this.loadAmenities();


        // load amenities
        this.amenityEntityService.loaded$
            .pipe(
                tap(loaded => {
                    this.isLoaded = loaded;
                    if (!loaded) {
                        this.amenityEntityService.getAll();
                    }
                }),
            ).subscribe(data => {
            this.amenities$ = this.amenityEntityService.entities$;
            this.amenityEntityService.entities$.subscribe(amenities => {
                this.amenities = amenities;

                this.allAmenitiesOptions = this.amenities.map(
                    x => new CheckboxItem(x.id, x.amenity_display_name));
            });
        });

        // load utilities
        this.utilityEntityService.loaded$
            .pipe(
                tap(loaded => {
                    this.isLoaded = loaded;
                    if (!loaded) {
                        this.utilityEntityService.getAll();
                    }
                }),
            ).subscribe(data => {
            this.utilityEntityService.entities$.subscribe(utilities => {
                this.utilities = utilities;
                this.allUtilitiesOptions = this.utilities.map(
                    x => new CheckboxItem(x.id, x.utility_display_name));
            });
        });

        this.utilitySummaryFormGroup = this._formBuilder.group({
            property_id: [''],
            utility_id: [''],

            /*unit_id: [''],
            reading_date: [''],
            current_reading: [''],

            base_charge: [''],
            previous_reading: [''],

            rate_per_unit: [''],
            units: [''],
            total: [''],*/
        });

        this.entryChoiceFormGroup = this._formBuilder.group({
            entry_type: [this.entryType]
        });

        this.autoDataEntryFormGroup = this._formBuilder.group({
            entry_type: [this.entryType]
        });

        this.manualUtilityBillsFormGroup = this._formBuilder.group({
            entry_type: [this.entryType],
            property_id: [''],
           /* unit_id: [''],
            utility_id: [''],

            reading_date: [''],
            current_reading: [''],

            base_charge: [''],
            previous_reading: [''],

            rate_per_unit: [''],
            units: [''],
            total: [''],*/
            unitBills: this.fb.array([ this.createUnitUtilityBillField() ]),
        });

        this.tenantsFormGroup = this._formBuilder.group({
            tenants: this.fb.array([ this.createTenantField() ]),
        });

        this.leaseSettingsFormGroup = this._formBuilder.group({
            secondCtrl: ['', Validators.required]
        });
    }

    /**
     * For mat-button-toggle-group to select either commercial or residential property unit
     * @param val
     */
    public onToggleChange(val: string) {
        this.entryType = val;
    }

    /**
     * Load loadPaymentFrequencies
     */
    loadPaymentFrequencies() {
        this.paymentFrequencyEntityService.loaded$
            .pipe(
                tap(loaded => {
                    this.isLoaded = loaded;
                    if (!loaded) {
                        this.paymentFrequencyEntityService.getAll();
                    }
                }),
            ).subscribe(data => {
            this.paymentFrequencies$ = this.paymentFrequencyEntityService.entities$;
        });
    }

    /**
     * Load Utility entities either from API or store
     */
    loadTenants () {
        this.tenantEntityService.loaded$
            .pipe(
                tap(loaded => {
                    this.isLoaded = loaded;
                    if (!loaded) {
                        this.tenantEntityService.getAll();
                    }
                }),
            ).subscribe(data => {
            this.tenants$ = this.tenantEntityService.entities$;
        });
    }

    /**
     * Load property Types
     */
    loadTenantTypes() {
        this.tenantTypeEntityService.loaded$
            .pipe(
                tap(loaded => {
                    this.isLoaded = loaded;
                    if (!loaded) {
                        this.tenantTypeEntityService.getAll();
                    }
                }),
            ).subscribe(data => {
            this.tenantTypes$ = this.tenantTypeEntityService.entities$;
        });
    }

    /**
     * Load Lease Modes
     */
    loadLeaseModes() {
        this.leaseModeEntityService.loaded$
            .pipe(
                tap(loaded => {
                    this.isLoaded = loaded;
                    if (!loaded) {
                        this.leaseModeEntityService.getAll();
                    }
                }),
            ).subscribe(data => {
            this.leaseModes$ = this.leaseModeEntityService.entities$;
        });
    }

    /**
     * Load Lease Types
     */
    loadLeaseTypes() {
        this.leaseTypeEntityService.loaded$
            .pipe(
                tap(loaded => {
                    this.isLoaded = loaded;
                    if (!loaded) {
                        this.leaseTypeEntityService.getAll();
                    }
                }),
            ).subscribe(data => {
            this.leaseTypes$ = this.leaseTypeEntityService.entities$;
        });
    }

    /**
     * Load property Types
     */
    loadPropertyTypes() {
        this.propertyTypeEntityService.loaded$
            .pipe(
                tap(loaded => {
                    this.isLoaded = loaded;
                    if (!loaded) {
                        this.propertyTypeEntityService.getAll();
                    }
                }),
            ).subscribe(data => {
            this.propertyTypes$ = this.propertyTypeEntityService.entities$;
        });
    }

    /**
     * Load Utility entities either from API or store
     */
    loadUtilities () {
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
     * Load Amenity entities either from store or API
     */
    loadAmenities() {
        this.amenityEntityService.loaded$
            .pipe(
                tap(loaded => {
                    this.isLoaded = loaded;
                    if (!loaded) {
                        this.amenityEntityService.getAll();
                    }
                }),
            ).subscribe(data => {
            this.amenities$ = this.amenityEntityService.entities$;
        });
    }

    /**
     * Generate fields for a data row
     */
    createUnitUtilityBillField(data?: any): FormGroup {
        return this.fb.group({
            unit_id: [''],
            reading_date: [''],
            current_reading: [''],

           /* utility_id: [''],
            property_id: [''],
            base_charge: [''],
            previous_reading: [''],

            rate_per_unit: [''],
            units: [''],
            total: [''],*/
        });
    }

    /**
     * Add an extra data row
     * @param data Default data
     */
    addUnitUtilityBillField(data?: any): void {
        this.unitUtilityBills = this.manualUtilityBillsFormGroup.get('unitBills') as FormArray;
        this.unitUtilityBills.push(this.createUnitUtilityBillField(data));
    }

    /**
     * remove an existing data row
     */
    removeUnitUtilityBillField(i): void {
        this.unitUtilityBills = this.manualUtilityBillsFormGroup.get('unitBills') as FormArray;
        this.unitUtilityBills.removeAt(i);
        const item = this.unitUtilityBillValues.splice(i, 1);
    }

    /**
     * Generate fields for a data row
     */
    createTenantField(data?: any): FormGroup {
        return this.fb.group({
            tenant_id: [''],
            first_name: [{value: '', disabled: true}],
            id_passport_number: [{value: '', disabled: true}],
        });
    }

    /**
     * Add an extra data row
     * @param data Default data
     */
    addTenantField(data?: any): void {
        this.utilityDeposits = this.tenantsFormGroup.get('tenants') as FormArray;
        this.utilityDeposits.push(this.createTenantField(data));
    }

    /**
     * remove an existing data row
     */
    removeTenantField(i): void {
        this.tenantFields = this.tenantsFormGroup.get('tenants') as FormArray;
        this.tenantFields.removeAt(i);
        const item = this.tenantValues.splice(i, 1);
    }

    /**
     * Generate fields for a data row
     */
    createUtilityDepositField(data?: any): FormGroup {
        return this.fb.group({
            utility_id: [''],
            deposit_amount: [''],
        });
    }

    /**
     * Add an extra data row
     * @param data Default data
     */
    addUtilityDepositField(data?: any): void {
        this.utilityDeposits = this.depositsFormGroup.get('utilityDeposits') as FormArray;
        this.utilityDeposits.push(this.createUtilityDepositField(data));
    }

    /**
     * remove an existing data row
     */
    removeUtilityDepositField(i): void {
        this.unitFields = this.depositsFormGroup.get('utilityDeposits') as FormArray;
        this.unitFields.removeAt(i);
        const item = this.unitValues.splice(i, 1);

        console.log('Removed = ', item);
        console.log('After remove: ', this.unitValues);
    }

    /**
     * Generate fields for a data row
     */
    createUnitField(data?: any): FormGroup {
        return this.fb.group({
            unit_name: [data?.unit_name]
        });
    }

    /**
     * Create member
     */
    create() {
        this.errorInForm.next(false);

        const unitBills = {...this.utilitySummaryFormGroup.value, ...this.manualUtilityBillsFormGroup.value};

        this.loader = true;

        this.utilityBillEntityService.add(unitBills).subscribe((data) => {
               // this.onSaveComplete();
                this.notification.showNotification('success', 'Success !! Bills Generated.');
            },
            (error) => {
                this.errorInForm.next(true);

                this.loader = false;
                if (error.member === 0) {
                    this.notification.showNotification('danger', 'Connection Error !! Nothing created.' +
                        ' Check your connection and retry.');
                    return;
                }
                // An array of all form errors as returned by server
                this.formErrors = error?.error;

                if (this.formErrors) {

                    // loop through from fields, If has an error, mark as invalid so mat-error can show
                    if (this.formErrors) {
                        // loop through from fields, If has an error, mark as invalid so mat-error can show
                        for (const prop in this.formErrors) {
                            this.stepper.selectedIndex = 0;

                            if (this.utilitySummaryFormGroup.controls[prop]) {
                                this.utilitySummaryFormGroup.controls[prop]?.markAsTouched();
                                this.utilitySummaryFormGroup.controls[prop].setErrors({incorrect: true});
                            }
                            if (this.manualUtilityBillsFormGroup.controls[prop]) {
                                this.manualUtilityBillsFormGroup.controls[prop]?.markAsTouched();
                                this.manualUtilityBillsFormGroup.controls[prop].setErrors({incorrect: true});
                            }
                        }
                    }
                }

            });
    }

    /**
     *
     */
/*    update() {
        const body = Object.assign({}, this.tenant, this.form.value);
        delete body.membership_form;

        this.loader = true;
        this.errorInForm.next(false);

        this.utilityBillEntityService.update(body).subscribe((data) => {
                this.loader = false;

                this.dialogRef.close(this.form.value);

                // notify success
                this.notification.showNotification('success', 'Success !! Tenant has been updated.');

            },
            (error) => {
                this.loader = false;
                this.errorInForm.next(true);
               // this.formError$.subscribe(subscriber => {subscriber.next(true)});

                if (error.tenant === 0) {
                    // notify error
                    return;
                }
                // An array of all form errors as returned by server
                this.formErrors = error?.error;
              //  this.formErrors = error.error.error.errors;

                if (this.formErrors) {
                    // loop through from fields, If has an error, mark as invalid so mat-error can show
                    for (const prop in this.formErrors) {
                        if (this.form) {
                            this.form.controls[prop]?.markAsTouched();
                            this.form.controls[prop]?.setErrors({incorrect: true});
                        }
                    }
                }
            });
    }

    close() {
        this.dialogRef.close();
    }

    /!**
     *
     *!/
    public onSaveComplete(): void {
        this.loader = false;
        this.form.reset();
        this.dialogRef.close(this.form.value);
    }*/

}

