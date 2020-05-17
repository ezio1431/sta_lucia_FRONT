import { Component, ElementRef, Inject, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatStepper } from '@angular/material/stepper';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PropertyModel } from '../models/property-model';
import { PropertyService } from '../data/property.service';

import { NotificationService } from '../../shared/notification.service';
import * as moment from 'moment';
import { PropertyEntityService } from '../data/property-entity.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { LandlordModel } from '../../landlords/models/landlord-model';
import { AddLandlordComponent } from '../../landlords/add/add-landlord.component';
import { PropertyUnitDetailsComponent } from './unit-details/property-unit-details.component';
import { tap } from 'rxjs/operators';
import { TypeDataService } from '../../settings/property/type/data/type-data.service';
import { TypeEntityService } from '../../settings/property/type/data/type-entity.service';
import { UtilityEntityService } from '../../settings/property/utility/data/utility-entity.service';
import { AmenityEntityService } from '../../settings/property/amenity/data/amenity-entity.service';
import { CheckboxItem } from '../../settings/property/roles/edit/check-box-item';

@Component({
    selector: 'robi-add-member',
    styles: [],
    templateUrl: './add-property.component.html'
})
export class AddPropertyComponent implements OnInit  {

    form: FormGroup;
    unitFields: FormArray;

    unitValues = [];

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

    landlord: PropertyModel;

    @ViewChild('stepper', {static: true }) stepper: MatStepper;


    isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;

    details = 'noooone';

    isLoaded: boolean;
    propertyTypes$: Observable<any>;

    utilities$: Observable<any>;
    amenities$: Observable<any>;

    allAmenitiesOptions = new Array<CheckboxItem>();
    allUtilitiesOptions = new Array<CheckboxItem>();
    amenities: any;
    utilities: any;

    constructor(private fb: FormBuilder,
                private dialog: MatDialog,
                private _formBuilder: FormBuilder,
                private memberService: PropertyService,
                private landlordEntityService: PropertyEntityService,
                private notification: NotificationService,
                private propertyTypeEntityService: TypeEntityService,
                private utilityEntityService: UtilityEntityService,
                private amenityEntityService: AmenityEntityService) {
    }

    ngOnInit() {

        this.loadPropertyTypes();
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
            firstCtrl: ['', Validators.required]
        });
        this.secondFormGroup = this._formBuilder.group({
            secondCtrl: ['', Validators.required]
        });
            this.form = this.fb.group({
                landlord_id: ['', [Validators.required,
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

        const dialogRef = this.dialog.open(PropertyUnitDetailsComponent, dialogConfig);

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
     * @param file
     */
    onMembershipFormInputSelect(file: FileList) {

        if (file.length > 0) {
            this.membershipFormFileToUpload = file.item(0);

            const reader = new FileReader();

            reader.onload = (event: any) => {
                this.membershipFormUrl = event.target.result;
            };

            reader.readAsDataURL(this.membershipFormFileToUpload);
        }
    }

    /**
     *
     * @param event
     */
    onFileSelect(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.form.get('passport_photo').setValue(file);
        }
    }

    /**
     *
     * @param file
     */
    membershipFormUpload(file: FileList) {

        if (file.length > 0) {
            this.membershipFormToUpload = file.item(0);

            const reader = new FileReader();

            reader.onload = (event: any) => {
                this.membershipFormUrl = event.target.result;
            };
            reader.readAsDataURL(this.membershipFormToUpload);
        }
    }

    /**
     * Create member
     */
    create() {
        this.errorInForm.next(false);

        const body = Object.assign({}, this.landlord, this.form.value);
        body.units = this.unitValues;

        const formData = new FormData();
        if (this.profilePicFileToUpload != null) {
            formData.append('passport_photo', this.profilePicFileToUpload);
        }
        if (this.membershipFormToUpload != null) {
            formData.append('membership_form', this.membershipFormToUpload);
        }

        for (const key in body) {
            if (body.hasOwnProperty(key)) {
                formData.append(key, body[key]);
            }
        }
        this.loader = true;

        this.landlordEntityService.add(body).subscribe((data) => {
               // this.onSaveComplete();
                this.notification.showNotification('success', 'Success !! Landlord created.');
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

            });
    }

    /**
     *
     */
/*    update() {
        const body = Object.assign({}, this.landlord, this.form.value);
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

                if (error.landlord === 0) {
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

