import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PropertyModel } from '../models/property-model';
import { PropertyService } from '../data/property.service';

import { NotificationService } from '../../shared/notification.service';
import { PropertyEntityService } from '../data/property-entity.service';
import { BehaviorSubject, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { PropertyUnitDetailsComponent } from './unit-details/property-unit-details.component';
import { debounceTime, delay, distinctUntilChanged, filter, map, takeUntil, tap } from 'rxjs/operators';
import { TypeEntityService } from '../../settings/property/type/data/type-entity.service';
import { UtilityEntityService } from '../../settings/property/utility/data/utility-entity.service';
import { AmenityEntityService } from '../../settings/property/amenity/data/amenity-entity.service';
import { CheckboxItem } from '../../settings/property/roles/edit/check-box-item';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { UnitTypeEntityService } from '../../settings/property/unit-type/data/unit-type-entity.service';
import { LandlordService } from '../../landlords/data/landlord.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LATE_FEE_TYPES } from '../../shared/enums/late-fee-type.enums';
import { RentPeriods } from '../../shared/enums/rent-period';
import { EXTRA_CHARGE_TYPES } from '../../shared/enums/extra-charge-type-enum';
import { EXTRA_CHARGE__FREQUENCIES } from '../../shared/enums/extra-charge-frequency-enum';
import { ExtraChargeService } from '../../settings/property/extra-charges/data/extra-charge.service';
import { AGENT_COMMISSION_TYPES } from '../../shared/enums/agent-commision-type-enum';
import { UTILITY_TYPES } from '../../shared/enums/utility-types-enum';
import { PaymentMethodService } from '../../settings/payment/payment-method/data/payment-method.service';

@Component({
    selector: 'robi-add-member',
    styles: [],
    templateUrl: './add-property.component.html'
})
export class AddPropertyComponent implements OnInit, OnDestroy  {

    form: FormGroup;
    unitFields: FormArray;
    lateFeeFields: FormArray;
    paymentMethodFields: FormArray;
    extraChargeFields: FormArray;
    utilityFields: FormArray;

    unitValues = [];
    lateFeeValues = [];

    formErrors: any;
    // formError$: Observable<boolean>;

    private errorInForm = new BehaviorSubject<boolean>(false);
    formError$ = this.errorInForm.asObservable();

    member: PropertyModel;

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

    property: PropertyModel;

    @ViewChild('stepper', {static: true }) stepper: MatStepper;


    isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    fourthFormGroup: FormGroup;

    details = 'noooone';

    isLoaded: boolean;
    propertyTypes$: Observable<any>;

    utilities$: Observable<any>;
    amenities$: Observable<any>;
    unitTypes$: Observable<any>;

    allAmenitiesOptions = new Array<CheckboxItem>();
    allUtilitiesOptions = new Array<CheckboxItem>();
    amenities: any;
    utilities: any;
    utilityTypes: any;
    lateFeeTypes: any;
    agentCommissionTypes: any;
    extraChargeTypes: any;
    extraChargeFrequencies: any;
    extraCharges: any;
    paymentMethods: any;

    logoToUpload: File = null;
    logoUrl = '';
    showLogo: any;

    photoToUpload: File = null;
    photoName: any;
    photoUrl = '';
    showPhoto: any;
    progress = 0;

    landlords: any = [];

    /** control for filter for server side. */
    public landlordServerSideFilteringCtrl: FormControl = new FormControl();

    /** indicate search operation is in progress */
    public searching = false;

    /** list of banks filtered after simulating server side search */
    public  filteredServerSideLandlords: ReplaySubject<any> = new ReplaySubject<any>(1);

    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

    constructor(private fb: FormBuilder,
                private dialog: MatDialog,
                private _formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private landlordService: LandlordService,
                private extraChargeService: ExtraChargeService,
                private paymentMethodService: PaymentMethodService,
                private router: Router,
                private propertyService: PropertyService,
                private landlordEntityService: PropertyEntityService,
                private notification: NotificationService,
                private propertyTypeEntityService: TypeEntityService,
                private unitTypeEntityService: UnitTypeEntityService,
                private utilityEntityService: UtilityEntityService,
                private amenityEntityService: AmenityEntityService) {

      /*  this.landlordService.list(['first_name', 'middle_name', 'last_name'])
            .subscribe((res) => this.landlords = res,
                () => this.landlords = []
            );*/

        if (this.route.snapshot.data['landlords']) {
            this.landlords = this.route.snapshot.data['landlords'];
        }
        this.lateFeeTypes = LATE_FEE_TYPES;
        this.extraChargeTypes = EXTRA_CHARGE_TYPES;
        this.extraChargeFrequencies = EXTRA_CHARGE__FREQUENCIES;
        this.agentCommissionTypes = AGENT_COMMISSION_TYPES;
        this.utilityTypes = UTILITY_TYPES;
    }

    ngOnInit() {

        // Extra Charges list
        this.extraChargeService.list(['extra_charge_name', 'extra_charge_display_name'])
            .subscribe((res) => this.extraCharges = res,
                () => this.extraCharges = []
            );

        // Payment Method list
        this.paymentMethodService.list(['name', 'display_name'])
            .subscribe((res) => this.paymentMethods = res,
                () => this.paymentMethods = []
            );


        // listen for search field value changes
        this.landlordServerSideFilteringCtrl.valueChanges
            .pipe(
                filter(search => !!search),
                tap(() => this.searching = true),
                takeUntil(this._onDestroy),
                debounceTime(200),
                distinctUntilChanged(),
                map(search => {
                    if (!this.landlords) {
                        return [];
                    }
                    search = search.toLowerCase();
                    console.log('search', search);

                    // simulate server fetching and filtering data
                    return this.landlords.filter(landlord => {
                        return landlord.first_name.toLowerCase().indexOf(search) > -1
                            || landlord.last_name.toLowerCase().indexOf(search) > -1;
                    });
                }),
                delay(500)
            )
            .subscribe(filteredLandlords => {
                    this.searching = false;
                    this.filteredServerSideLandlords.next(filteredLandlords);
                },
                error => {
                    this.searching = false;
                });


        /*
                            || landlord.middle_name.toLowerCase().indexOf(search) > -1
                            || landlord.last_name.toLowerCase().indexOf(search) > -1
         || member.phone.toLowerCase().indexOf(search) > -1
             || member.account?.account_number.toLowerCase().indexOf(search) > -1
             || member.id_number.toLowerCase().indexOf(search) > -1*/



        this.loadPropertyTypes();
        this.loadUnitTypes();
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

        this.firstFormGroup = this._formBuilder.group({
            landlord_id: ['', [Validators.required,
                Validators.minLength(2)]],
            property_name: ['', [Validators.required,
                Validators.minLength(2)]],
            location: [''],
            property_code: ['', [Validators.required,
                Validators.minLength(2)]],
            property_type_id: ['', [Validators.required,
                Validators.minLength(2)]],
            unitFields: this.fb.array([ this.createUnitField() ])
        });
        this.secondFormGroup = this._formBuilder.group({
            agent_commission_value: [''],
            agent_commission_type: [''],
          //  lateFeeFields: this.fb.array([ this.lateFeeFieldCreate() ]),
            paymentMethodFields: this.fb.array([ this.paymentMethodFieldCreate() ])
        });

        this.thirdFormGroup = this._formBuilder.group({
            extraChargeFields: this.fb.array([ this.extraChargeFieldCreate() ]),
          //  utilityFields: this.fb.array([ this.utilityFieldCreate() ])
        });

        this.fourthFormGroup = this._formBuilder.group({
            utilityFields: this.fb.array([ this.utilityFieldCreate() ])
        });
    }


    /**
     * Fetch all defined fields
     */
    get utilityFieldsAll () {
        return <FormArray>this.fourthFormGroup.get('utilityFields');
    }

    /**
     * Generate fields for a data row
     */
    utilityFieldCreate(data?: any): FormGroup {
        return this.fb.group({
            utility_id: [data?.utility_id],
            utility_type: [data?.utility_type],
            unit_cost: [data?.unit_cost],
            standard_fee: [data?.standard_fee],
        });
    }

    /**
     * Add an extra data row
     * @param data Default data
     */
    utilityFieldAdd(data?: any): void {
        this.utilityFields = this.fourthFormGroup.get('utilityFields') as FormArray;
        this.utilityFields.push(this.utilityFieldCreate(data));
    }

    /**
     * remove an existing data row
     */
    utilityFieldRemove(i): void {
        this.utilityFields = this.fourthFormGroup.get('utilityFields') as FormArray;
        this.utilityFields.removeAt(i);
        //  this.lateFeeValues.splice(i, 1);
    }

    /**
     * Copy an existing data row to a new one
     * Makes an extra data object with an id same as size of the previous data array
     * @param i
     */
    utilityFieldCopy(i): void {
        this.utilityFields = this.fourthFormGroup.get('utilityFields') as FormArray;
        const holder = [];
        holder.push(this.utilityFields.value[i])
        this.utilityFieldAdd(...holder);
    }

    /**
     * Fetch all defined fields
     */
    get extraChargeFieldsAll () {
        return <FormArray>this.thirdFormGroup.get('extraChargeFields');
    }

    /**
     * Generate fields for a data row
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
        this.extraChargeFields = this.thirdFormGroup.get('extraChargeFields') as FormArray;
        this.extraChargeFields.push(this.extraChargeFieldCreate(data));
    }

    /**
     * remove an existing data row
     */
    extraChargeFieldRemove(i): void {
        this.extraChargeFields = this.thirdFormGroup.get('extraChargeFields') as FormArray;
        this.extraChargeFields.removeAt(i);
        //  this.lateFeeValues.splice(i, 1);
    }

    /**
     * Copy an existing data row to a new one
     * Makes an extra data object with an id same as size of the previous data array
     * @param i
     */
    extraChargeFieldCopy(i): void {
        this.extraChargeFields = this.thirdFormGroup.get('extraChargeFields') as FormArray;
        const holder = [];
        holder.push(this.extraChargeFields.value[i])
        this.extraChargeFieldAdd(...holder);
    }


    /**
     * Fetch all defined fields
     */
    get paymentMethodFieldsAll () {
        return <FormArray>this.secondFormGroup.get('paymentMethodFields');
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
     * Add an extra data row
     * @param data Default data
     */
    paymentMethodFieldAdd(data?: any): void {
        this.paymentMethodFields = this.secondFormGroup.get('paymentMethodFields') as FormArray;
        this.paymentMethodFields.push(this.paymentMethodFieldCreate(data));
    }

    /**
     * remove an existing data row
     */
    paymentMethodFieldRemove(i): void {
        this.paymentMethodFields = this.secondFormGroup.get('paymentMethodFields') as FormArray;
        this.paymentMethodFields.removeAt(i);
      //  this.lateFeeValues.splice(i, 1);
    }

    /**
     * Copy an existing data row to a new one
     * Makes an extra data object with an id same as size of the previous data array
     * @param i
     */
    paymentMethodFieldCopy(i): void {
        this.paymentMethodFields = this.secondFormGroup.get('paymentMethodFields') as FormArray;
        const holder = [];
        holder.push(this.paymentMethodFields.value[i])
        this.paymentMethodFieldAdd(...holder);
    }


    /**
     * Fetch all defined fields
     */
   /* get lateFeeFieldsAll () {
        return <FormArray>this.secondFormGroup.get('lateFeeFields');
    }*/

    /**
     * Generate fields for a data row
     */
   /* lateFeeFieldCreate(data?: any): FormGroup {
        return this.fb.group({
            late_fee_value: [data?.late_fee_value],
            late_fee_type: [data?.late_fee_type]
        });
    }*/

    /**
     * Add an extra data row
     * @param data Default data
     */
   /* lateFeeFieldAdd(data?: any): void {
        this.lateFeeFields = this.secondFormGroup.get('lateFeeFields') as FormArray;
        this.lateFeeFields.push(this.lateFeeFieldCreate(data));
    }*/

    /**
     * remove an existing data row
     */
  /*  lateFeeFieldRemove(i): void {
        this.lateFeeFields = this.secondFormGroup.get('lateFeeFields') as FormArray;
        this.lateFeeFields.removeAt(i);
        this.lateFeeValues.splice(i, 1);
    }*/

    /**
     * Copy an existing data row to a new one
     * Makes an extra data object with an id same as size of the previous data array
     * @param i
     */
    /*lateFeeFieldCopy(i): void {
        this.lateFeeFields = this.secondFormGroup.get('lateFeeFields') as FormArray;
        const holder = [];
        holder.push(this.lateFeeFields.value[i])
        this.lateFeeFieldAdd(...holder);
    }*/

    /**
     * Generate fields for a data row
     */
    createUnitField(data?: any): FormGroup {
        return this.fb.group({
            unit_name: [data?.unit_name],
            unit_type_name: [this.unitTypeName(data?.unit_type_id)]
        });
    }

    /**
     * Fetch all defined fields
     */
    get allUnitFields () {
        return <FormArray>this.firstFormGroup.get('unitFields');
    }

    /**
     * Add an extra data row
     * @param data Default data
     */
    addUnitField(data?: any): void {
        this.unitFields = this.firstFormGroup.get('unitFields') as FormArray;
        this.unitFields.push(this.createUnitField(data));
    }

    /**
     * remove an existing data row
     */
    removeUnitField(i): void {
        this.unitFields = this.firstFormGroup.get('unitFields') as FormArray;
        this.unitFields.removeAt(i);
        const item = this.unitValues.splice(i, 1);
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
     * Load property Types
     */
    loadUnitTypes() {
        this.unitTypeEntityService.loaded$
            .pipe(
                tap(loaded => {
                    this.isLoaded = loaded;
                    if (!loaded) {
                        this.unitTypeEntityService.getAll();
                    }
                }),
            ).subscribe(data => {
            this.unitTypes$ = this.unitTypeEntityService.entities$;
        });
    }

    /**
     * Gets a unit type name give id
     * @param id
     */
    unitTypeName(id) {
        let result;
        this.unitTypes$.subscribe(unitTypes => {
            result = unitTypes.find((item: any) => item.id === id)?.unit_type_display_name;
        })
        return result;
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
     * Pop up dialog form to capture unit details. Also Edit existing data.
     * Save data on dialog close
     * Add dialog launch
     */
    addUnitDetails(number) {
        let edit = false;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

      //  console.log(number);
        const unitValue = this.unitValues[number];

     //   console.log('unitValue', unitValue);

        if (typeof unitValue !== 'undefined') {
            edit = true;
            console.log(' MODE EDIT');
        }

        dialogConfig.data = {unitValue,
            utilities: this.utilities$,
            amenities: this.amenities$,
            unitTypes: this.unitTypes$,
            amenitiesData: this.amenities,
            amenityOptions: this.allAmenitiesOptions,
            utilityOptions: this.allUtilitiesOptions,
        };

        const dialogRef = this.dialog.open(PropertyUnitDetailsComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            if ((result)) {

                console.log('giku ... result', result)

                const resultData = result.data;
                resultData.id = number;

                if (edit === true) {
                    const elementsIndex = this.unitValues.findIndex(element => element.id === number );
                    console.log(' elementsIndex', elementsIndex);

                    const newArray = [...this.unitValues];

                  //  newArray[elementsIndex] = {...newArray[elementsIndex], completed: !newArray[elementsIndex].completed}
                    newArray.splice(elementsIndex, 1, resultData);

                    this.unitValues = newArray.slice();

                    this.unitFields = this.firstFormGroup.get('unitFields') as FormArray;
                    this.unitFields.at(number).patchValue({
                        unit_name: result.data.unit_name,
                      //  unit_type_name: result.data.unit_type_id,
                        unit_type_name: this.unitTypeName(result.data.unit_type_id),
                    });
                } else {
                    this.unitValues.push(resultData);

                    this.unitFields = this.firstFormGroup.get('unitFields') as FormArray;
                    this.unitFields.at(number).patchValue({
                        unit_name: result.data.unit_name,
                        unit_type_name: this.unitTypeName(result.data.unit_type_id),
                    });
                }
            }
        });
    }



    /**
     *
     * @param event
     */
    detectFiles(event) {
        this.urls = [];
        const files = event.target.files;
        if (files) {
            for (const file of files) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    this.urls.push(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        }
    }

    /**
     *
     * @param file
     */
    handleFileInput(file: FileList) {
        this.profilePicFileToUpload = file.item(0);

        const reader = new FileReader();

        reader.onload = (event: any) => {
            this.profilePicUrl = event.target.result;
        };

        reader.readAsDataURL(this.profilePicFileToUpload);
    }

    /**
     *
     * @param file
     */
    onProfilePicSelect(file: FileList) {

        if (file.length > 0) {
            this.profilePicFileToUpload = file.item(0);

            const reader = new FileReader();

            reader.onload = (event: any) => {
                this.profilePicUrl = event.target.result;
            };
            reader.readAsDataURL(this.profilePicFileToUpload);
        }
    }

    /**
     *
     * @param image
     */
    createImageFromBlob(image: Blob) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            this.showPhoto = of(reader.result);
        }, false);

        if (image) {
            reader.readAsDataURL(image);
        }
    }




    /**
     *
     * @param file
     */
    onProfilePhotoSelect(file: FileList) {
        if (file.length > 0) {
            this.photoToUpload = file.item(0);
            this.photoName = file.item(0).name;
            const reader = new FileReader();
            reader.onload = (event: any) => {
                this.photoUrl = event.target.result;
            };
            reader.readAsDataURL(this.photoToUpload);

            this.loader = true;
            // upload to server

            const formData = new FormData();
            formData.append('photo', this.photoToUpload);
          //  formData.append('id',  this.settingId);

            // Upload Photo
            this.uploadPhoto(formData);
        }
    }

    /**
     * Upload profile image to server
     * @param formData
     */
    private uploadPhoto(formData: FormData) {
        // Upload photo
        this.propertyService.uploadPhoto(formData)
            .subscribe((event: HttpEvent<any>) => {

                    console.log('file upload');
                    console.log(event.type);

                    if (event.type === HttpEventType.UploadProgress) {
                        console.log('Progress', event.loaded);
                    }
                });
    }

    /**
     * Create member
     */
    create() {
        this.errorInForm.next(false);

        const data = {...this.firstFormGroup.value, ...this.secondFormGroup.value,
            ...this.thirdFormGroup.value, ...this.fourthFormGroup.value};

        const body = Object.assign({}, this.property, data);
        body.units = this.unitValues;

       /* const formData = new FormData();
        if (this.profilePicFileToUpload != null) {
            formData.append('property_photo', this.profilePicFileToUpload);
        }
        if (this.membershipFormToUpload != null) {
            formData.append('membership_form', this.membershipFormToUpload);
        }

        for (const key in body) {
            if (body.hasOwnProperty(key)) {
                formData.append(key, body[key]);
            }
        }*/
        this.loader = true;

        this.propertyService.create(body)
            .subscribe((res) => {
                console.log('formData');
                console.log(body);
                    this.notification.showNotification('success', 'Success !! New Property created.');
                },
                (error) => {
                    this.loader = false;
                    if (error.lead === 0) {
                        this.notification.showNotification('danger', 'Connection Error !! Nothing created.' +
                            ' Check your connection and retry.');
                        return;
                    }
                    // An array of all form errors as returned by server
                    this.formErrors = error;

                    if (this.formErrors) {
                        // loop through from fields, If has an error, mark as invalid so mat-error can show
                        for (const prop in this.formErrors) {
                            this.stepper.selectedIndex = 0;

                            if (this.fourthFormGroup.controls[prop]) {
                                this.fourthFormGroup.controls[prop]?.markAsTouched();
                                this.fourthFormGroup.controls[prop].setErrors({incorrect: true});
                            }
                            if (this.thirdFormGroup.controls[prop]) {
                                this.thirdFormGroup.controls[prop]?.markAsTouched();
                                this.thirdFormGroup.controls[prop].setErrors({incorrect: true});
                            }
                            if (this.secondFormGroup.controls[prop]) {
                                this.secondFormGroup.controls[prop]?.markAsTouched();
                                this.secondFormGroup.controls[prop].setErrors({incorrect: true});
                            }
                            if (this.firstFormGroup.controls[prop]) {
                                this.firstFormGroup.controls[prop]?.markAsTouched();
                                this.firstFormGroup.controls[prop].setErrors({incorrect: true});
                            }
                        }
                    }

                });

      /*  this.landlordEntityService.add(body).subscribe((data) => {
               // this.onSaveComplete();
                this.notification.showNotification('success', 'Success !! Property created.');
                this.router.navigateByUrl('/properties');

                // Upload image
                formData.append('property_id', data.id);
                this.propertyService.uploadPhoto(formData)
                    .subscribe((xx) => {
                        console.log('uploading image after ...xx')
                    });
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
                    for (const prop in this.formErrors) {
                        if (this.form) {
                            this.form.controls[prop]?.markAsTouched();
                            this.form.controls[prop]?.setErrors({incorrect: true});
                        }
                    }
                }

            });*/
    }

    /**
     *
     */
/*    update() {
        const body = Object.assign({}, this.property, this.form.value);
        delete body.membership_form;

        this.loader = true;
        this.errorInForm.next(false);

        this.landlordEntityService.update(body).subscribe((data) => {
                this.loader = false;

                this.dialogRef.close(this.form.value);

                // notify success
                this.notification.showNotification('success', 'Success !! Landlord has been updated.');

            },
            (error) => {
                this.loader = false;
                this.errorInForm.next(true);
               // this.formError$.subscribe(subscriber => {subscriber.next(true)});

                if (error.property === 0) {
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
    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
}

