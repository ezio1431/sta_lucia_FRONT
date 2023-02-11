import { AfterViewInit, Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';
import { PropertyService } from '../../data/property.service';
import { CheckboxItem } from './check-box-item';
import { BILLING_FREQUENCIES } from '../../../shared/enums/billing-frequency-enum';

@Component({
    selector: 'robi-add-member',
    templateUrl: './property-unit-details.component.html',
    styleUrls: ['./property-unit-details.component.scss']
})
export class PropertyUnitDetailsComponent implements OnInit, AfterViewInit  {

    form: FormGroup;

    formErrors: any;

    private errorInForm = new BehaviorSubject<boolean>(false);
    formError$ = this.errorInForm.asObservable();

    member: any;

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

    mode: 'add' | 'edit';
    landlord: any;
    unitValue: any;

    public selectedUnitType: string;

    @ViewChild('stepper', {static: true }) stepper: MatStepper;


    panelOpenState = false;
    disableAnimation = true;

    billingFrequencies: any;

    utilities$: any;
    amenities$: any;
    unitTypes$: any;

    amenities = Array<CheckboxItem>();
    optionsAmenity = Array<CheckboxItem>();
    optionsUtility = Array<CheckboxItem>();
    selectedValuesAmenity: string[];
    selectedValuesUtility: string[];
    @Output() toggle = new EventEmitter<any[]>();

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private memberService: PropertyService,
                private landlordEntityService: PropertyService,
                private notification: PropertyService,
                private dialogRef: MatDialogRef<PropertyUnitDetailsComponent>) {
            this.unitValue = row.unitValue;
            this.utilities$ = row.utilities;
            this.amenities$ = row.amenities$;
            this.unitTypes$ = row.unitTypes$;
            this.amenities = row.amenitiesData;
            this.optionsAmenity = row.amenityOptions;
            this.optionsUtility = row.utilityOptions;

        this.billingFrequencies = BILLING_FREQUENCIES;
        //  this.selectedValues = this.role.permissions.map(x => x['id']);
    }

    ngOnInit() {

        this.selectedValuesAmenity = this.unitValue?.selected_amenities ? this.unitValue?.selected_amenities : [];
        this.selectedValuesUtility = this.unitValue?.selected_utilities ? this.unitValue?.selected_utilities : [];

        this.selectedUnitType = this.unitValue ? this.unitValue?.unit_mode : 'residential';

            this.form = this.fb.group({
                unit_mode: [this.selectedUnitType],
                unit_type_id: [this.unitValue?.unit_type_id],
                unit_name: [this.unitValue?.unit_name, [Validators.required,
                    Validators.minLength(1)]],
                unit_floor: [this.unitValue?.unit_floor],
                rent_amount: [this.unitValue?.rent_amount],
               // billing_frequency: [this.unitValue?.billing_frequency],
                bed_rooms: [this.unitValue?.bed_rooms],
                bath_rooms: [this.unitValue?.bath_rooms],
                square_foot: [this.unitValue?.square_foot],
                total_rooms: [this.unitValue?.total_rooms],
                utilityFields: new FormArray([]),
                amenityFields: new FormArray([]),
            });




        this.form.valueChanges.subscribe(value => {
            const optionsChecked = new Array<any>();
            for (let index = 0; index < this.itemsAmenities.length; index++) {
                const isOptionChecked =
                    this.itemsAmenities.get(index.toString()).value;
                if (isOptionChecked) {
                    const currentOptionValue =
                        this.optionsAmenity[index].value;
                    optionsChecked.push(currentOptionValue);
                }
            }
            this.toggle.emit(optionsChecked);
        });

        this.form.valueChanges.subscribe(value => {
            const optionsChecked = new Array<any>();
            for (let index = 0; index < this.itemsUtilities.length; index++) {
                const isOptionChecked =
                    this.itemsUtilities.get(index.toString()).value;
                if (isOptionChecked) {
                    const currentOptionValue =
                        this.optionsUtility[index].value;
                    optionsChecked.push(currentOptionValue);
                }
            }
            this.toggle.emit(optionsChecked);
        });



        if (this.itemsAmenities.length === 0) {
            this.optionsAmenity.forEach(x => {
                this.itemsAmenities.push(new FormControl(false));
            });
        }

        if (this.itemsUtilities.length === 0) {
            this.optionsUtility.forEach(x => {
                this.itemsUtilities.push(new FormControl(false));
            });
        }

        this.selectedValuesAmenity.forEach(value => {
            const index: number =
                this.optionsAmenity.findIndex(opt => opt.value === value);
            if (index >= 0) {
                this.itemsAmenities.get(index.toString()).setValue(true);
            }
        });

        this.selectedValuesUtility.forEach(value => {
            const index: number =
                this.optionsUtility.findIndex(opt => opt.value === value);
            if (index >= 0) {
                this.itemsUtilities.get(index.toString()).setValue(true);
            }
        });
    }

    /**
     *
     */
    private selectedAmenities() {
        return this.form.value.amenityFields
            .map((v, i) => v ? this.optionsAmenity[i].value : null)
            .filter(v => v !== null);
    }

    /**
     *
     */
    get itemsAmenities(): FormArray {
        return this.form.get('amenityFields') as FormArray;
    }

    /**
     *
     */
    private selectedUtilities() {
        return this.form.value.utilityFields
            .map((v, i) => v ? this.optionsUtility[i].value : null)
            .filter(v => v !== null);
    }

    /**
     *
     */
    get itemsUtilities(): FormArray {
        return this.form.get('utilityFields') as FormArray;
    }

    // Workaround for angular component issue #13870
    ngAfterViewInit(): void {
        // timeout required to avoid the dreaded 'ExpressionChangedAfterItHasBeenCheckedError'
        setTimeout(() => this.disableAnimation = false);
    }

    /**
     * For mat-button-toggle-group to select either commercial or residential property unit
     * @param val
     */
    public onToggleChange(val: string) {
        this.selectedUnitType = val;
    }

    /**
     * Send data back
     * @param data
     */
    closeDialog(data) {
        console.log('xxxxDATxxxx', data);
        data.selected_amenities = this.selectedAmenities();
        data.selected_utilities = this.selectedUtilities();
        console.log('Data with selected amenities', data);
        this.dialogRef.close({ event: 'close', data: data });
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
     * Create or Update Data
     */
    createOrUpdate() {
        switch (this.mode) {
            case 'edit' : {
               // this.update();
            }
                break;
            case 'add' : {
              //  this.create();
            }
                break;
            default :
                break;
        }
       // this.dialogRef.close(this.form.value);
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

