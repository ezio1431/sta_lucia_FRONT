import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';

import { fromEvent, merge, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

import { NotificationService } from '../../../shared/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralSettingService } from '../../general/data/general-setting.service';
import { GeneralSettingModel } from '../../general/model/general-setting.model';
import { select, Store } from '@ngrx/store';
import { selectSettings } from '../../../core/settings/settings.selectors';
import { SettingsState, State } from '../../../core/settings/settings.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'robi-system-general-setting',
    templateUrl: './system-general-setting.component.html',
    styleUrls: ['./system-general-setting.component.css']
})
export class SystemGeneralSettingComponent implements OnInit {
    form: FormGroup;
    formErrors: any;
    loader = false;

    setting: GeneralSettingModel;
    settings$: Observable<SettingsState>;

    settingId: string;

    dateFormats: any;
    amountThousandSeparators: any;
    amountDecimalSeparators: any;
    amountDecimals: any;

    logoToUpload: File = null;
    logoUrl = '';
    showLogo: any;

    photoToUpload: File = null;
    photoName: any;
    photoUrl = '';
    showPhoto: any;


    dialogRef: MatDialogRef<ConfirmationDialogComponent>;

    // Search field
    @ViewChild('search', {static: true}) search: ElementRef;
    // pagination
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    // Pagination
    length: number;
    pageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    meta: any;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    // Data for the list table display

    roles: any = [];
    employees: any = [];
    branches: any = [];

    constructor(private store: Store<State>, private fb: FormBuilder, private route: ActivatedRoute,
                private generalSettingService: GeneralSettingService, private notification: NotificationService) {

        this.form = this.fb.group({
            business_name: ['', [Validators.required,
                Validators.minLength(3)]],
            business_type: ['', [Validators.required,
                Validators.minLength(3)]],
            email: ['',
                [Validators.required,
                    Validators.minLength(3)]],
            currency: [''],
            phone: [''],
            physical_address: [''],
            postal_address: [''],
            postal_code: [''],
            date_format: [''],
            amount_thousand_separator: [''],
            amount_decimal_separator: [''],
            amount_decimal: [''],
        });
    }

    /**
     * Initialize data source
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        this.settings$ = this.store.pipe(select(selectSettings));

        if (this.route.snapshot.data['setting']) {
            this.setting = this.route.snapshot.data['setting'].data;
            this.prePopulateForm(this.setting);
            this.settingId = this.setting.id;
            // Fetch photo
            this.getImageFromService();

            // Populate select drop down data
            this.dateFormats = this.setting.date_formats;
            this.amountThousandSeparators = this.setting.amount_thousand_separators;
            this.amountDecimalSeparators = this.setting.amount_decimal_separators;
            this.amountDecimals = this.setting.amount_decimals;
        }
    }

    /**
     *
     * @param setting
     */
    prePopulateForm(setting: GeneralSettingModel) {
        this.setting = setting;

        this.form.patchValue({
            business_name: this.setting.business_name,
            business_type: this.setting.business_type,
            email: this.setting.email,
            currency: this.setting.currency,
            phone: this.setting.phone,
            country: this.setting.country,
            county: this.setting.county,
            town: this.setting.town,
            physical_address: this.setting.physical_address,
            postal_address: this.setting.postal_address,
            postal_code: this.setting.postal_code,
            logo: this.setting.logo,
            date_format: this.setting.date_format,
            amount_thousand_separator: this.setting.amount_thousand_separator,
            amount_decimal_separator: this.setting.amount_decimal_separator,
            amount_decimal: this.setting.amount_decimal
        });
    }

    onSubmit() {}

    /**
     *
     * @param file
     */
    onLogoSelect(file: FileList) {
        if (file.length > 0) {
            this.logoToUpload = file.item(0);
            const reader = new FileReader();
            reader.onload = (event: any) => {
                this.logoUrl = event.target.result;
            };
            reader.readAsDataURL(this.logoToUpload);
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
            formData.append('logo', this.photoToUpload);
            formData.append('id',  this.settingId);

            // Upload Photo
            this.uploadPhoto(formData);
        }
    }

    /**
     *
     */
    getImageFromService() {
        if (this.setting && this.setting.logo !== null) {
            this.generalSettingService.fetchPhoto(this.settingId).subscribe(data => {
                this.createImageFromBlob(data);
            }, error => {
            });
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
     * Upload profile image to server
     * @param formData
     */
    private uploadPhoto(formData: FormData) {
        // Upload photo
        this.generalSettingService.updatePhoto(formData)
            .subscribe((data) => {
                    this.loader = false;
                    this.getImageFromService();
                    // notify success
                    this.notification.showNotification('success', 'Success !! Logo has been updated.');
                },
                (error) => {
                    this.loader = false;
                    if (error.payment === 0) {
                        return;
                    }
                    // An array of all form errors as returned by server
                    this.formErrors = error;

                    if (this.formErrors) {
                        // loop through from fields, If has an error, mark as invalid so mat-error can show
                        for (const prop in this.formErrors) {
                            if (this.form) {
                                this.form.controls[prop].setErrors({incorrect: true});
                            }
                        }
                    }
                });
    }


    /**
     * Update settings
     */
    update() {

        const body = Object.assign({}, this.setting, this.form.value);

        const formData = new FormData();
        formData.append('logo', this.logoToUpload);
        formData.append('id', body.id);

        this.loader = true;
        this.generalSettingService.update(body)
            .subscribe((data) => {
                    this.loader = false;
                    // notify success
                    this.notification.showNotification('success', 'Success !! Admin Setting has been updated.');
                    setTimeout(() => {
                        this.notification.showNotification('success', 'Action !! Login to continue ...');
                    }, 1000);
                },
                (error) => {
                    this.loader = false;

                    if (error.payment === 0) {
                        return;
                    }
                    // An array of all form errors as returned by server
                    this.formErrors = error;

                    if (this.formErrors) {
                        // loop through from fields, If has an error, mark as invalid so mat-error can show
                        for (const prop in this.formErrors) {
                            if (this.form) {
                                this.form.controls[prop].setErrors({incorrect: true});
                            }
                        }
                    }
                });
    }
}
