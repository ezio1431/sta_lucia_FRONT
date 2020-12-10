import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TenantModel } from '../models/tenant-model';
import { TenantService } from '../data/tenant.service';

import { NotificationService } from '../../shared/notification.service';
import { TenantEntityService } from '../data/tenant-entity.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TenantUnitDetailsComponent } from './unit-details/tenant-unit-details.component';
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

@Component({
    selector: 'robi-add-tenant',
    styles: [],
    templateUrl: './add-tenant.component.html'
})
export class AddTenantComponent implements OnInit  {

    form: FormGroup;
    unitFields: FormArray;

    unitValues = [];

    formErrors: any;
    // formError$: Observable<boolean>;

    private errorInForm = new BehaviorSubject<boolean>(false);
    formError$ = this.errorInForm.asObservable();

    member: TenantModel;

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

    tenant: TenantModel;

    @ViewChild('stepper', {static: true }) stepper: MatStepper;


    isLinear = false;
    existingTenantFormGroup: FormGroup;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    fourthFormGroup: FormGroup;

    personalFormGroup: FormGroup;
    employmentFormGroup: FormGroup;
    businessFormGroup: FormGroup;
    nextOfKinFormGroup: FormGroup;
    tenantSettingsFormGroup: FormGroup;

    details = 'noooone';

    isLoaded: boolean;
    invalid: boolean;

    propertyTypes$: Observable<any>;
    tenantTypes$: Observable<any>;
    leaseModes$: Observable<any>;
    leaseTypes$: Observable<any>;
    paymentFrequencies$: Observable<any>;

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

    constructor(private fb: FormBuilder,
                private dialog: MatDialog,
                private _formBuilder: FormBuilder,
                private propertyService: TenantService,
                private tenantEntityService: TenantEntityService,
                private notification: NotificationService,
                private propertyTypeEntityService: TypeEntityService,
                private tenantTypeEntityService: TenantTypeEntityService,
                private leaseModeEntityService: LeaseModeEntityService,
                private leaseTypeEntityService: LeaseTypeEntityService,
                private utilityEntityService: UtilityEntityService,
                private paymentFrequencyEntityService: PaymentFrequencyEntityService,
                private amenityEntityService: AmenityEntityService) {
        this.newTenant = 'new';
    }

    ngOnInit() {

        this.loadPropertyTypes();

      //  this.loadPropertyTypes();
        this.loadLeaseTypes();
        this.loadLeaseModes();
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

        this.personalFormGroup = this._formBuilder.group({
            tenant_type_id: [''],
            first_name: [''],
            middle_name: [''],
            last_name: [''],
            gender: [''],
            date_of_birth: [''],
            id_passport_number: [''],
            marital_status: [''],

            contact_phone: [''],
            contact_email: [''],
            nationality: [''],

            city_state: [''],
            postal_code: [''],
            postal_address: [''],
            physical_address: ['']
        });

        this.nextOfKinFormGroup = this._formBuilder.group({
            next_of_kin_name: [''],
            next_of_kin_phone: [''],
            next_of_kin_relation: [''],

            rent_payment_contact: [''],
            rent_payment_contact_postal_address: [''],
            rent_payment_contact_physical_address: [''],

            emergency_contact_name: [''],
            emergency_contact_phone: [''],
            emergency_contact_email: [''],
            emergency_contact_relationship: [''],
            emergency_contact_postal_address: [''],
            emergency_contact_physical_address: ['']
        });

        this.businessFormGroup = this._formBuilder.group({
            business_name: [''],
            registration_number: [''],
            business_industry: [''],
            business_description: [''],
            business_address: [''],
        });

        this.employmentFormGroup = this._formBuilder.group({
            employment_status: [''],
            employment_position: [''],
            employer_contact_phone: [''],
            employer_contact_email: [''],
            employment_postal_address: [''],
            employment_physical_address: ['']
        });

        this.tenantSettingsFormGroup = this._formBuilder.group({
            secondCtrl: ['', Validators.required]
        });

        this.existingTenantFormGroup = this._formBuilder.group({
            new_tenant: [this.newTenant],
            tenant_id: [''],
            first_name: [{value: '', disabled: true}],
            other_names: [{value: '', disabled: true}],
        });
        this.firstFormGroup = this._formBuilder.group({
            tenant_type_id: [''],

            first_name: [''],
            other_names: [''],

            date_of_birth: [''],
            id_passport_number: [''],
            gender: [''],

            nationality: [''],
            city_state: [''],
            postal_zip_code: [''],

            business_name: [''],
            business_address: [''],
            registration_number: [''],
            business_industry: [''],
            business_description: [''],
        });
        this.secondFormGroup = this._formBuilder.group({

            contact_phone: [''],
            contact_email: [''],

            emergency_phone: [''],
            emergency_email: [''],

            next_of_kin_phone: [''],
            next_of_kin_name: [''],

            next_of_kin_relation: [''],

            postal_address: [''],
            physical_address: [''],

        });
        this.thirdFormGroup = this._formBuilder.group({
            lease_type_id: [''],
            lease_mode_id: [''],
            property_id: [''],
            unit_id: [''],
            start_date: [''],
            end_date: [''],
            due_date: [''],
            rent_amount: [''],
            payment_frequency_id: [''],
            due_on: [''],
            agreement_doc: [''],
            rent_deposit: [''],

            utility_deposits: this.fb.array([ this.createUnitField() ]),
            extra_charges: this.fb.array([ this.createUnitField() ]),
        });
        this.fourthFormGroup = this._formBuilder.group({
            secondCtrl: ['', Validators.required]
        });
            this.form = this.fb.group({
                tenant_id: ['', [Validators.required,
                    Validators.minLength(2)]],
                property_name: ['', [Validators.required,
                    Validators.minLength(2)]],
                location: [''],
                property_type_id: ['', [Validators.required,
                    Validators.minLength(2)]],
                unitFields: this.fb.array([ this.createUnitField() ])
            });
    }

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
     * Add an extra data row
     * @param data Default data
     */
    addUnitField(data?: any): void {
        this.unitFields = this.form.get('unitFields') as FormArray;
        this.unitFields.push(this.createUnitField(data));
    }

    /**
     * remove an existing data row
     */
    removeUnitField(i): void {
        this.unitFields = this.form.get('unitFields') as FormArray;
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
    copyUnitField(i): void {

        const unitValue = this.unitValues[i];
        const size = this.unitValues.length;

        const newCopyUnit = {...unitValue};
        newCopyUnit.id = size;

        this.unitValues.push(newCopyUnit);
        this.addUnitField(newCopyUnit);
    }


    /**
     * Pop up dialog form to capture unit details. Also Edit existing data.
     * Save data on dialog close
     * Add dialog launch
     */
    addUnitDetails(number) {
        let edit = false;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        console.log(number);
        const unitValue = this.unitValues[number];

        console.log('unitValue', unitValue);

        if (typeof unitValue !== 'undefined') {
            edit = true;
            console.log(' MODE EDIT');
        }

        dialogConfig.data = {unitValue,
            utilities: this.utilities$,
            amenities: this.amenities$,
            amenitiesData: this.amenities,
            amenityOptions: this.allAmenitiesOptions,
            utilityOptions: this.allUtilitiesOptions,
        };

        const dialogRef = this.dialog.open(TenantUnitDetailsComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            if ((result)) {

                const resultData = result.data;
                resultData.id = number;

                if (edit === true) {
                    const elementsIndex = this.unitValues.findIndex(element => element.id === number );
                    console.log(' elementsIndex', elementsIndex);

                    const newArray = [...this.unitValues];

                  //  newArray[elementsIndex] = {...newArray[elementsIndex], completed: !newArray[elementsIndex].completed}
                    newArray.splice(elementsIndex, 1, resultData);

                    this.unitValues = newArray.slice();

                    this.unitFields = this.form.get('unitFields') as FormArray;
                    this.unitFields.at(number).patchValue({
                        unit_name: result.data.unit_name,
                    });

                    console.log(' *****NEWWWW this.unitValues', this.unitValues);

                } else {
                    // this.unitValues.push(result.data);
                    this.unitValues.push(resultData);

                    console.log('Added data: ', this.unitValues);

                    this.unitFields = this.form.get('unitFields') as FormArray;
                    this.unitFields.at(number).patchValue({
                        unit_name: result.data.unit_name,
                    });
                }
            }
        });
    }

    /**
     * Create member
     */
    create() {
        this.errorInForm.next(false);

        let tenantData: any;

        if (this.newTenant === 'new') {
            const tenantFormData = {...this.firstFormGroup.value, ...this.secondFormGroup.value};
            tenantData = Object.assign({}, this.tenant, tenantFormData);
        } else {
            const tenantFormData = {...this.existingTenantFormGroup.value};
            tenantData = Object.assign({}, this.tenant, tenantFormData);
        }

        const leaseData = {...this.thirdFormGroup.value};
        const leaseSettingData = {...this.fourthFormGroup.value};

        const body = Object.assign({});
        body.tenant = tenantData;
        body.lease = leaseData;
        body.lease_settings = leaseSettingData;

       // const tenantFields = {...this.personalFormGroup.value, ...this.nextOfKinFormGroup.value, ...this.employmentFormGroup.value};
        const tenantFields = {...this.personalFormGroup.value, ...this.nextOfKinFormGroup.value, ...this.employmentFormGroup.value};

      //  const body = tenantData;
        this.loader = true;

        this.tenantEntityService.add(tenantFields).subscribe((data) => {
               // this.onSaveComplete();
                this.notification.showNotification('success', 'Success !! Tenant created.');
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

          /*      if (this.formErrors) {

                    // loop through from fields, If has an error, mark as invalid so mat-error can show
                    for (const prop in this.formErrors) {
                        if (this.form) {
                            this.form.controls[prop]?.markAsTouched();
                            this.form.controls[prop]?.setErrors({incorrect: true});
                        }
                    }
                }*/


                if (this.formErrors) {
                    // loop through from fields, If has an error, mark as invalid so mat-error can show
                    for (const prop in this.formErrors) {
                        this.stepper.selectedIndex = 0;

                        if (this.personalFormGroup.controls[prop]) {
                            this.personalFormGroup.controls[prop]?.markAsTouched();
                            this.personalFormGroup.controls[prop].setErrors({incorrect: true});
                        }
                        if (this.nextOfKinFormGroup.controls[prop]) {
                            this.nextOfKinFormGroup.controls[prop]?.markAsTouched();
                            this.nextOfKinFormGroup.controls[prop].setErrors({incorrect: true});
                        }
                        if (this.employmentFormGroup.controls[prop]) {
                            this.employmentFormGroup.controls[prop]?.markAsTouched();
                            this.employmentFormGroup.controls[prop].setErrors({incorrect: true});
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

        this.tenantEntityService.update(body).subscribe((data) => {
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

