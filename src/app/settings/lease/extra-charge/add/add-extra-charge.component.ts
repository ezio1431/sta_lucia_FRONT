import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from '../../../../shared/notification.service';
import { ExtraChargeModel } from '../model/extra-charge-model';
import { ExtraChargeService } from '../data/extra-charge.service';
import { AmenityModel } from '../../../property/amenity/model/amenity-model';
import { AmenityService } from '../../../property/amenity/data/amenity.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'robi-add-extra-charge',
    styles: [],
    templateUrl: './add-extra-charge.component.html'
})
export class AddExtraChargeComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    private errorInForm = new BehaviorSubject<boolean>(false);
    formError$ = this.errorInForm.asObservable();

    loader = false;

    formGroup: FormGroup;

    isAdd: boolean;
    extraCharge: ExtraChargeModel;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private extraChargeService: ExtraChargeService,
                private translateService: TranslateService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<AddExtraChargeComponent>) {
        this.isAdd = row.isAdd;
        this.extraCharge = row.extraCharge;
    }

    ngOnInit() {
        if (this.isAdd) {
            this.form = this.fb.group({
                extra_charge_name: ['', [Validators.required,
                    Validators.minLength(2)]],
                extra_charge_display_name: [''],
                extra_charge_description: ['']
            });
        }

        if (!this.isAdd) {
            this.form = this.fb.group({
                extra_charge_name: [this.extraCharge?.extra_charge_name, [Validators.required,
                    Validators.minLength(3)]],
                extra_charge_display_name: [this.extraCharge?.extra_charge_display_name],
                extra_charge_description: [this.extraCharge?.extra_charge_description]
            });
        }
    }

    /**
     * Create member
     */
    create() {
        this.errorInForm.next(false);

        const body = Object.assign({}, this.extraCharge, this.form.value);

        this.loader = true;

        this.extraChargeService.create(body).subscribe((data) => {
                this.onSaveComplete();
                this.notification.showNotification('success',
                    this.translateService.instant('settings.lease.extra_charges.notifications.extra_charge_created'));
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
        const body = Object.assign({}, this.extraCharge, this.form.value);
        delete body.membership_form;

        this.loader = true;
        this.errorInForm.next(false);

        this.extraChargeService.update(body).subscribe((data) => {
                this.loader = false;

                this.dialogRef.close(this.form.value);

                // notify success
                this.notification.showNotification('success',
                    this.translateService.instant('settings.lease.extra_charges.notifications.extra_charge_updated'));

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

