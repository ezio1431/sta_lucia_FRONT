import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { InvoiceModel } from '../models/invoice-model';
import { InvoiceService } from '../data/invoice.service';

import { NotificationService } from '../../shared/notification.service';
import { InvoiceEntityService } from '../data/invoice-entity.service';
import { BehaviorSubject, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { UtilityBillUnitDetailsComponent } from './unit-details/utility-bill-unit-details.component';
import { debounceTime, delay, distinctUntilChanged, filter, map, takeUntil, tap } from 'rxjs/operators';
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
import { PropertyService } from '../../properties/data/property.service';
import { MatSelect } from '@angular/material/select';
import * as moment from 'moment';

@Component({
    selector: 'robi-add-tenant',
    styles: [],
    templateUrl: './add-invoice.component.html'
})
export class AddInvoiceComponent implements OnInit  {

    properties: any = [];

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

    member: InvoiceModel;

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

    tenant: InvoiceModel;

    @ViewChild('stepper', {static: true }) stepper: MatStepper;


    isLinear = false;
    manualUtilityBillsFormGroup: FormGroup;
    entryChoiceFormGroup: FormGroup;
    autoDataEntryFormGroup: FormGroup;

    utilitySummaryFormGroup: FormGroup;
    utilityBillsFormGroup: FormGroup;

    utilityBillFields: FormArray;


    details = 'noooone';

    isLoaded: boolean;
    isManualEntry = true;
    isAutoImport = false;

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

    units: any = [];
    units$ = of([]);
    utilityCharges$ = of([]);

    /** control for filter for server side. */
    public propertyServerSideFilteringCtrl: FormControl = new FormControl();
    /** list of tenants filtered after simulating server side search */
    public  filteredServerSideProperties: ReplaySubject<any> = new ReplaySubject<any>(1);

    /** indicate search operation is in progress */
    public searching = false;

    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

    constructor(private fb: FormBuilder,
                private dialog: MatDialog,
                private _formBuilder: FormBuilder,
                private propertyService: PropertyService,
                private utilityBillEntityService: InvoiceEntityService,
                private utilityBillService: InvoiceService,
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
        // Load properties list
        this.propertyService.list(['property_name', 'location'])
            .subscribe((res) => this.properties = res,
                () => this.properties = []
            );
    }

    ngOnInit() {

        // Property Search
        this.propertyServerSideFilteringCtrl.valueChanges
            .pipe(
                filter(search => !!search),
                tap(() => this.searching = true),
                takeUntil(this._onDestroy),
                debounceTime(200),
                distinctUntilChanged(),
                map(search => {
                    if (!this.properties) {
                        return [];
                    }
                    search = search.toLowerCase();
                    console.log('search', search);

                    // simulate server fetching and filtering data
                    return this.properties.filter(property => {
                        console.log('property', property);
                        return property.property_name.toLowerCase().indexOf(search) > -1
                            || property.location.toLowerCase().indexOf(search) > -1;
                    });
                }),
                delay(500)
            )
            .subscribe(filteredProperties => {
                    this.searching = false;
                    this.filteredServerSideProperties.next(filteredProperties);
                },
                error => {
                    this.searching = false;
                });

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
            property_id: ['', [Validators.required]],
            utility_id: ['', [Validators.required]],
        });

        /*this.entryChoiceFormGroup = this._formBuilder.group({
            entry_type: [this.entryType]
        });*/

        /*this.autoDataEntryFormGroup = this._formBuilder.group({
            entry_type: [this.entryType]
        });*/

        this.utilityBillsFormGroup = this._formBuilder.group({
            unitBills: this.fb.array([ this.utilityBillFieldCreate() ]),
        });
    }

    /**
     * Update supporting fields when property drop down changes content
     * @param value
     */
    onPropertyItemChange(value) {
        this.units = this.properties.find((item: any) => item.id === value).units;
        this.units$ = of(this.properties.find((item: any) => item.id === value).units);
    }

    /**
     * Update supporting fields when unit drop down changes content
     * @param value
     */
    onUnitItemChange(value) {
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


    /*Start Utility Bill section*/

    /**
     * Fetch all defined fields
     */
    get utilityBillFieldsAll () {
        return <FormArray>this.utilityBillsFormGroup.get('unitBills');
    }

    /**
     * Initial field creation
     * @param data
     */
    utilityBillFieldCreate(data?: any): FormGroup {
        return this.fb.group({
            unit_id: [data?.unit_id, [Validators.required]],
            reading_date: [data ? data?.reading_date : (new Date()).toISOString().substring(0, 10), [Validators.required]],
            current_reading: [data?.current_reading, [Validators.required]],
        });
    }

    /**
     * Add an extra data row
     * @param data Default data
     */
    utilityBillFieldAdd(data?: any): void {
        this.utilityBillFields = this.utilityBillsFormGroup.get('unitBills') as FormArray;
        this.utilityBillFields.push(this.utilityBillFieldCreate(data));
    }

    /**
     * remove an existing data row
     */
    utilityBillFieldRemove(i): void {
        this.utilityBillFields = this.utilityBillsFormGroup.get('unitBills') as FormArray;
        this.utilityBillFields.removeAt(i);
    }

    /**
     * Copy an existing data row to a new one
     * Makes an extra data object with an id same as size of the previous data array
     * @param i
     */
    utilityBillFieldCopy(i): void {
        this.utilityBillFields = this.utilityBillsFormGroup.get('unitBills') as FormArray;
        const holder = [];
        holder.push(this.utilityBillFields.value[i])
        this.utilityBillFieldAdd(...holder);
    }

    /* End Utility Bills section*/

    /**
     * Create member
     */
    create() {
        this.errorInForm.next(false);

        const unitBills = {...this.utilitySummaryFormGroup.value, ...this.utilityBillsFormGroup.value};

        this.loader = true;

        this.utilityBillService.create(unitBills).subscribe((data) => {
               // this.onSaveComplete();
                this.notification.showNotification('success', 'Success !! Utility Readings Added.');
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
                            if (this.utilityBillsFormGroup.controls[prop]) {
                                this.utilityBillsFormGroup.controls[prop]?.markAsTouched();
                                this.utilityBillsFormGroup.controls[prop].setErrors({incorrect: true});
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

