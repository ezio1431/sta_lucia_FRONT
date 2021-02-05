import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LeaseModel } from '../models/lease-model';
import { LeaseService } from '../data/lease.service';

import { NotificationService } from '../../shared/notification.service';
import { LeaseEntityService } from '../data/lease-entity.service';
import { BehaviorSubject, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { LeaseUnitDetailsComponent } from './unit-details/lease-unit-details.component';
import { debounceTime, delay, distinctUntilChanged, filter, map, take, takeUntil, tap } from 'rxjs/operators';
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
import { switchMap } from 'rxjs-compat/operator/switchMap';
import { MatSelect } from '@angular/material/select';
import { PropertyService } from '../../properties/data/property.service';
import { ExtraChargeService } from '../../settings/property/extra-charges/data/extra-charge.service';
import { EXTRA_CHARGE_TYPES } from '../../shared/enums/extra-charge-type-enum';
import { EXTRA_CHARGE__FREQUENCIES } from '../../shared/enums/extra-charge-frequency-enum';
import { PaymentMethodService } from '../../settings/payment/payment-method/data/payment-method.service';
import { UTILITY_TYPES } from '../../shared/enums/utility-types-enum';
import { ActivatedRoute } from '@angular/router';
import { BILLING_FREQUENCIES } from '../../shared/enums/billing-frequency-enum';

@Component({
    selector: 'robi-add-tenant',
    styles: [],
    templateUrl: './add-lease.component.html'
})
export class AddLeaseComponent implements OnInit, AfterViewInit, OnDestroy  {

    unitFields: FormArray;
    utilityDeposits: FormArray;

    unitValues = [];

    tenantFields: FormArray;
    tenantValues = [];

    formErrors: any;
    // formError$: Observable<boolean>;

    private errorInForm = new BehaviorSubject<boolean>(false);
    formError$ = this.errorInForm.asObservable();

    member: LeaseModel;

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

    tenant: LeaseModel;

    @ViewChild('stepper', {static: true }) stepper: MatStepper;

    isLinear = false;

    leaseDetailsFormGroup: FormGroup;
    depositsFormGroup: FormGroup;
    tenantsFormGroup: FormGroup;
    extraChargesFormGroup: FormGroup;
    utilityChargesFormGroup: FormGroup;
    paymentMethodsFormGroup: FormGroup;

    extraChargeTypes: any;
    extraChargeFrequencies: any;
    extraChargesData: any;

    utilityTypes: any;
    billingFrequencies: any;
    paymentMethods: any;

    filteredTenant$: any;

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

    public newTenant: string;

    properties: any = [];
    propertyUnits: any = [];
    tenants: any = [];
    units: any = [];

    extraCharges: FormArray;

    paymentMethodFields: FormArray;
    utilityCharges: FormArray;

    properties$: Observable<any>;

    extraCharges$ = of([]);
    utilityCharges$ = of([]);
    paymentMethods$ = of([]);

    dueON = Array.from({length: (29 - 1)}, (v, k) => k + 1);

    /** control for filter for server side. */
    public propertyServerSideFilteringCtrl: FormControl = new FormControl();
    /** list of tenants filtered after simulating server side search */
    public  filteredServerSideProperties: ReplaySubject<any> = new ReplaySubject<any>(1);


    /** control for filter for server side. */
    public tenantServerSideFilteringCtrl: FormControl = new FormControl();
    /** list of tenants filtered after simulating server side search */
    public  filteredServerSideTenants: ReplaySubject<any> = new ReplaySubject<any>(1);

    /** indicate search operation is in progress */
    public searching = false;

    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

    /** control for the MatSelect filter keyword multi-selection */
    public tenantMultiFilterCtrl: FormControl = new FormControl();

    /** list of tenants filtered by search keyword */
    public filteredTenantsMulti: ReplaySubject<any> = new ReplaySubject<any>(1);

    @ViewChild('tenantSelect', { static: true }) tenantSelect: MatSelect;

    /** control for the MatSelect filter keyword multi-selection */
    public unitMultiFilterCtrl: FormControl = new FormControl();

    /** list of units filtered by search keyword */
    public filteredUnitsMulti: ReplaySubject<any> = new ReplaySubject<any>(1);

    @ViewChild('unitSelect', { static: true }) unitSelect: MatSelect;

    /**
     * fetch tenant fields
     */
    get tenantsCtrl() {
        return <FormControl>this.tenantsFormGroup.get('tenants');
    }

    /**
     * fetch tenant fields
     */
    get unitsCtrl() {
        return <FormControl>this.leaseDetailsFormGroup.get('units');
    }

    constructor(private fb: FormBuilder,
                private dialog: MatDialog,
                private route: ActivatedRoute,
                private _formBuilder: FormBuilder,
                private propertyService: PropertyService,
                private paymentMethodService: PaymentMethodService,
                private leaseEntityService: LeaseEntityService,
                private notification: NotificationService,
                private extraChargeService: ExtraChargeService,
                private propertyTypeEntityService: TypeEntityService,
                private tenantTypeEntityService: TenantTypeEntityService,
                private leaseModeEntityService: LeaseModeEntityService,
                private leaseTypeEntityService: LeaseTypeEntityService,
                private utilityEntityService: UtilityEntityService,
                private paymentFrequencyEntityService: PaymentFrequencyEntityService,
                private tenantEntityService: TenantEntityService,
                private amenityEntityService: AmenityEntityService) {

        if (this.route.snapshot.data['properties']) {
            this.properties = this.route.snapshot.data['properties'];
        }
        this.newTenant = 'new';
        this.extraChargeTypes = EXTRA_CHARGE_TYPES;
        this.extraChargeFrequencies = EXTRA_CHARGE__FREQUENCIES;
        this.utilityTypes = UTILITY_TYPES;
        this.billingFrequencies = BILLING_FREQUENCIES;
    }

    /**
     * Sets the initial value after the filteredTenants are loaded initially
     */
    protected setTenantInitialValue() {
        this.filteredTenantsMulti
            .pipe(take(1), takeUntil(this._onDestroy))
            .subscribe(() => {
                // setting the compareWith property to a comparison function
                // triggers initializing the selection according to the initial value of
                // the form control (i.e. _initializeSelection())
                // this needs to be done after the filteredTenants are loaded initially
                // and after the mat-option elements are available
              //  this.tenantSelect.compareWith = (a: Tenant, b: Tenant) => a && b && a.id === b.id;
            });
    }

    protected filterTenantsMulti() {
        if (!this.tenants) {
            return;
        }
        // get the search keyword
        let search = this.tenantMultiFilterCtrl.value;
        if (!search) {
            this.filteredTenantsMulti.next(this.tenants.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the tenants
        this.filteredTenantsMulti.next(
            this.tenants.filter(tenant => tenant.first_name.toLowerCase().indexOf(search) > -1)
        );
    }

    /**
     * Sets the initial value after the filteredUnits are loaded initially
     */
    protected setUnitInitialValue() {
        this.filteredUnitsMulti
            .pipe(take(1), takeUntil(this._onDestroy))
            .subscribe(() => {
                // setting the compareWith property to a comparison function
                // triggers initializing the selection according to the initial value of
                // the form control (i.e. _initializeSelection())
                // this needs to be done after the filteredUnits are loaded initially
                // and after the mat-option elements are available
                //  this.unitSelect.compareWith = (a: Unit, b: Unit) => a && b && a.id === b.id;
            });
    }

    protected filterUnitsMulti() {
        if (!this.units) {
            return;
        }
        // get the search keyword
        let search = this.unitMultiFilterCtrl.value;
        if (!search) {
            this.filteredUnitsMulti.next(this.units.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the units
        this.filteredUnitsMulti.next(
            this.units.filter(unit => unit.unit_name.toLowerCase().indexOf(search) > -1)
        );
    }

    ngOnInit() {

        // Payment Method list
        this.paymentMethodService.list(['name', 'display_name'])
            .subscribe((res) => this.paymentMethods = res,
                () => this.paymentMethods = []
            );

        // Extra Charges list
        this.extraChargeService.list(['extra_charge_name', 'extra_charge_display_name'])
            .subscribe((res) => this.extraChargesData = res,
                () => this.extraChargesData = []
            );

        // load the initial tenant list
        this.filteredTenantsMulti.next(this.tenants.slice());

        // listen for search field value changes
        this.tenantMultiFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterTenantsMulti();
            });



        // Load properties list
       /* this.propertyService.list(['property_name', 'location'])
            .subscribe((res) => this.properties = res,
                () => this.properties = []
            );*/

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

        this.leaseDetailsFormGroup = this._formBuilder.group({
            lease_type_id: [''],
            lease_mode_id: [''],
            property_id: [''],
          //  unit_id: [''],
            units: [[]],
            start_date: [(new Date()).toISOString().substring(0, 10), [Validators.required]],
            end_date: [''],
            due_date: [''],
            rent_amount: [''],
            billing_frequency: ['monthly'],
            due_on: ['']
        });

        this.depositsFormGroup = this._formBuilder.group({
            rent_deposit: [''],
            utilityDeposits: this.fb.array([ this.utilityDepositFieldCreate() ]),
        });

        this.tenantsFormGroup = this._formBuilder.group({
            tenants: [[], Validators.required],
        });

        this.extraChargesFormGroup = this._formBuilder.group({
            extraCharges: this.fb.array([ this.extraChargeFieldCreate() ])
        });

        this.utilityChargesFormGroup = this._formBuilder.group({
            utilityCharges: this.fb.array([ this.utilityChargeCreate() ])
        });

        this.paymentMethodsFormGroup = this._formBuilder.group({
            paymentMethodFields: this.fb.array([ this.paymentMethodFieldCreate() ])
        });

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

    }


    ngAfterViewInit() {
        this.setTenantInitialValue();
       // this.setUnitInitialValue();
    }
    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    /**
     * Update supporting fields when property drop down changes content
     * @param value
     */
    onPropertyItemChange(value) {
        this.units = this.properties.find((item: any) => item.id === value).units;
        this.extraCharges$ = of(this.properties.find((item: any) => item.id === value)?.extra_charges);
        this.utilityCharges$ = of(this.properties.find((item: any) => item.id === value)?.utility_costs);
        this.paymentMethods$ = of(this.properties.find((item: any) => item.id === value)?.payment_methods);

        // load the initial tenant list
        this.filteredUnitsMulti.next(this.units.slice());

        // listen for search field value changes
        this.unitMultiFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterUnitsMulti();
            });

        this.extraCharges$.subscribe(charges => {
            this.extraChargesFormGroup.setControl('extraCharges', this.extraChargeFieldReplaceAll());
        });

        this.utilityCharges$.subscribe(utilities => {
                this.utilityChargesFormGroup.setControl('utilityCharges', this.utilityChargeReplaceAll());
        });

        this.paymentMethods$.subscribe(paymentMethods => {
                this.paymentMethodsFormGroup.setControl('paymentMethodFields', this.paymentMethodFieldReplaceAll());
        });
    }

    /*Start extra charge section*/

    /**
     * Fetch all defined fields
     */
    get extraChargeFieldAll () {
        return <FormArray>this.extraChargesFormGroup.get('extraCharges');
    }

    /**
     * Replace  fields for those filled with data from selected property
     */
    extraChargeFieldReplaceAll(): FormArray {
        const formArray =  new FormArray([]);
        this.extraCharges$.subscribe(charges => {
            charges.forEach(charge => {
                formArray.push(this.fb.group({
                    extra_charge_id: charge?.id,
                    extra_charge_value: charge?.pivot?.extra_charge_value,
                    extra_charge_type: charge?.pivot?.extra_charge_type,
                    extra_charge_frequency: charge?.pivot?.extra_charge_frequency
                }))
            });
        });
        return formArray;
    }

    /**
     * Initial field creation
     * @param data
     */
    extraChargeFieldCreate(data?: any): FormGroup {
        return this.fb.group({
            extra_charge_id: [data?.extra_charge_id],
            extra_charge_value: [data?.extra_charge_value],
            extra_charge_type: [data?.extra_charge_type],
            extra_charge_frequency: [data?.extra_charge_frequency]
        });
    }

    /**
     * Add an extra data row
     * @param data Default data
     */
    extraChargeFieldAdd(data?: any): void {
        this.extraCharges = this.extraChargesFormGroup.get('extraCharges') as FormArray;
        this.extraCharges.push(this.extraChargeFieldCreate(data));
    }

    /**
     * remove an existing data row
     */
    extraChargeFieldRemove(i): void {
        this.extraCharges = this.extraChargesFormGroup.get('extraCharges') as FormArray;
        this.extraCharges.removeAt(i);
    }

    /**
     * Copy an existing data row to a new one
     * Makes an extra data object with an id same as size of the previous data array
     * @param i
     */
    extraChargeFieldCopy(i): void {
        this.extraCharges = this.extraChargesFormGroup.get('extraCharges') as FormArray;
        const holder = [];
        holder.push(this.extraCharges.value[i])
        this.extraChargeFieldAdd(...holder);
    }

    /* End extra charge section*/

    /* Start utility charge section*/
    /**
     * Fetch all defined fields
     */
    get utilityChargesAll () {
        return <FormArray>this.utilityChargesFormGroup.get('utilityCharges');
    }

    /**
     * Generate fields for a data row
     */
    utilityChargeCreate(data?: any): FormGroup {
        return this.fb.group({
            utility_id: [data?.utility_id],
            utility_type: [data?.utility_type],
            unit_cost: [data?.unit_cost],
            fixed_fee: [data?.fixed_fee],
        });
    }

    /**
     * Replace  fields for those filled with data from selected property
     */
    utilityChargeReplaceAll(): FormArray {
        const formArray =  new FormArray([]);
        this.utilityCharges$.subscribe(charges => {
            charges.forEach(charge => {
                formArray.push(this.fb.group({
                    utility_id: charge?.id,
                    utility_type: charge?.pivot?.utility_type,
                    unit_cost: charge?.pivot?.utility_unit_cost,
                    standard_fee: charge?.pivot?.utility_standard_fee,
                }))
            });
        });
        return formArray;
    }

    /**
     * Add an extra data row
     * @param data Default data
     */
    utilityChargeAdd(data?: any): void {
        this.utilityCharges = this.utilityChargesFormGroup.get('utilityCharges') as FormArray;
        this.utilityCharges.push(this.utilityChargeCreate(data));
    }

    /**
     * remove an existing data row
     */
    utilityChargeRemove(i): void {
        this.utilityCharges = this.utilityChargesFormGroup.get('utilityCharges') as FormArray;
        this.utilityCharges.removeAt(i);
        //  this.lateFeeValues.splice(i, 1);
    }

    /**
     * Copy an existing data row to a new one
     * Makes an extra data object with an id same as size of the previous data array
     * @param i
     */
    utilityChargeCopy(i): void {
        this.utilityCharges = this.utilityChargesFormGroup.get('utilityCharges') as FormArray;
        const holder = [];
        holder.push(this.utilityCharges.value[i])
        this.utilityChargeAdd(...holder);
    }
    /* End utility charge section*/

    /* Start payment methods section*/
    /**
     * Fetch all defined fields
     */
    get paymentMethodFieldsAll () {
        return <FormArray>this.paymentMethodsFormGroup.get('paymentMethodFields');
    }

    /**
     * Generate fields for a data row
     */
    paymentMethodFieldCreate(data?: any): FormGroup {
        return this.fb.group({
            payment_method_id: [data?.payment_method_id],
            payment_method_description: [data?.payment_method_description]
        });
    }

    /**
     * Replace  fields for those filled with data from selected property
     */
    paymentMethodFieldReplaceAll(): FormArray {
        const formArray =  new FormArray([]);
        this.paymentMethods$.subscribe(charges => {
            charges.forEach(charge => {
                formArray.push(this.fb.group({
                    /*extra_charge_id: charge?.id,
                    extra_charge_value: charge?.pivot?.extra_charge_value,
                    extra_charge_type: charge?.pivot?.extra_charge_type,
                    extra_charge_frequency: charge?.pivot?.extra_charge_frequency,*/

                    payment_method_id: charge?.id,
                    payment_method_description: charge?.pivot?.payment_method_description,
                }))
            });
        });
        return formArray;
    }

    /**
     * Add an extra data row
     * @param data Default data
     */
    paymentMethodFieldAdd(data?: any): void {
        this.paymentMethodFields = this.paymentMethodsFormGroup.get('paymentMethodFields') as FormArray;
        this.paymentMethodFields.push(this.paymentMethodFieldCreate(data));
    }

    /**
     * remove an existing data row
     */
    paymentMethodFieldRemove(i): void {
        this.paymentMethodFields = this.paymentMethodsFormGroup.get('paymentMethodFields') as FormArray;
        this.paymentMethodFields.removeAt(i);
        //  this.lateFeeValues.splice(i, 1);
    }

    /**
     * Copy an existing data row to a new one
     * Makes an extra data object with an id same as size of the previous data array
     * @param i
     */
    paymentMethodFieldCopy(i): void {
        this.paymentMethodFields = this.paymentMethodsFormGroup.get('paymentMethodFields') as FormArray;
        const holder = [];
        holder.push(this.paymentMethodFields.value[i])
        this.paymentMethodFieldAdd(...holder);
    }

    /* End payment methods section*/

    /* Start utility deposit section*/
    get utilityDepositFieldsAll() {
        return <FormArray>this.depositsFormGroup.get('utilityDeposits');
    }

    /**
     * Generate fields for a data row
     */
    utilityDepositFieldCreate(data?: any): FormGroup {
        return this.fb.group({
            utility_id: [data?.utility_id],
            deposit_amount: [data?.deposit_amount]
        });
    }

    /**
     * Add an extra data row
     * @param data Default data
     */
    utilityDepositFieldAdd(data?: any): void {
        this.utilityDeposits = this.depositsFormGroup.get('utilityDeposits') as FormArray;
        this.utilityDeposits.push(this.utilityDepositFieldCreate(data));
    }

    /**
     * remove an existing data row
     */
    utilityDepositFieldRemove(i): void {
        this.unitFields = this.depositsFormGroup.get('utilityDeposits') as FormArray;
        this.unitFields.removeAt(i);
        const item = this.unitValues.splice(i, 1);

        console.log('Removed = ', item);
        console.log('After remove: ', this.unitValues);
    }

    /**
     * Copy an existing data row to a new one
     * Makes an extra data object with an id same as size of the previous data array
     * @param i
     */
    utilityDepositFieldCopy(i): void {
        this.utilityDeposits = this.depositsFormGroup.get('utilityDeposits') as FormArray;
        const holder = [];
        holder.push(this.utilityDeposits.value[i])
        this.utilityDepositFieldAdd(...holder);
    }
    /* End utility deposit section*/

    /**
     * For mat-button-toggle-group to select either commercial or residential property unit
     * @param val
     */
    public onToggleChange(val: string) {
        this.newTenant = val;
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
                this.tenantEntityService.entities$.subscribe( (tenantsData) => {
              //  console.log('data', tenantsData);
                this.tenants = tenantsData;
            });
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

        const lease = {
            ...this.leaseDetailsFormGroup.value,
            ...this.depositsFormGroup.value,
            ...this.tenantsFormGroup.value,
            ...this.extraChargesFormGroup.value,
            ...this.utilityChargesFormGroup.value,
            ...this.paymentMethodsFormGroup.value
        };

        this.loader = true;

        this.leaseEntityService.add(lease).subscribe((data) => {
               // this.onSaveComplete();
                this.notification.showNotification('success', 'Success !! Lease created.');
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
                            if (this.formErrors.hasOwnProperty(prop)) {
                                this.stepper.selectedIndex = 0;

                                if (this.leaseDetailsFormGroup.controls[prop]) {
                                    this.leaseDetailsFormGroup.controls[prop]?.markAsTouched();
                                    this.leaseDetailsFormGroup.controls[prop].setErrors({incorrect: true});
                                }
                                if (this.depositsFormGroup.controls[prop]) {
                                    this.depositsFormGroup.controls[prop]?.markAsTouched();
                                    this.depositsFormGroup.controls[prop].setErrors({incorrect: true});
                                }
                                if (this.tenantsFormGroup.controls[prop]) {
                                    this.tenantsFormGroup.controls[prop]?.markAsTouched();
                                    this.tenantsFormGroup.controls[prop].setErrors({incorrect: true});
                                }
                                if (this.extraChargesFormGroup.controls[prop]) {
                                    this.extraChargesFormGroup.controls[prop]?.markAsTouched();
                                    this.extraChargesFormGroup.controls[prop].setErrors({incorrect: true});
                                }
                                if (this.utilityChargesFormGroup.controls[prop]) {
                                    this.utilityChargesFormGroup.controls[prop]?.markAsTouched();
                                    this.utilityChargesFormGroup.controls[prop].setErrors({incorrect: true});
                                }
                                if (this.paymentMethodsFormGroup.controls[prop]) {
                                    this.paymentMethodsFormGroup.controls[prop]?.markAsTouched();
                                    this.paymentMethodsFormGroup.controls[prop].setErrors({incorrect: true});
                                }
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

        this.leaseEntityService.update(body).subscribe((data) => {
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

