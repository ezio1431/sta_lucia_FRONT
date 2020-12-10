import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from '../../../../shared/notification.service';
import { TenantTypeEntityService } from '../data/tenant-type-entity.service';
import { TenantTypeModel } from '../model/tenant-type-model';

@Component({
    selector: 'robi-add-lease-ype',
    styles: [],
    templateUrl: './add-tenant-type.component.html'
})
export class AddTenantTypeComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;
    // formError$: Observable<boolean>;

    private errorInForm = new BehaviorSubject<boolean>(false);
    formError$ = this.errorInForm.asObservable();

    loader = false;

    formGroup: FormGroup;

    mode: 'add' | 'edit';
    tenantType: TenantTypeModel;

    @ViewChild('stepper', {static: true }) stepper: MatStepper;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private tenantTypeEntityService: TenantTypeEntityService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<AddTenantTypeComponent>) {
        this.mode = row.mode;
        this.tenantType = row.tenantType;
    }

    ngOnInit() {

        if (this.mode === 'add') {
            this.form = this.fb.group({
                tenant_type_name: ['', [Validators.required,
                    Validators.minLength(2)]],
                tenant_type_display_name: [''],
                tenant_type_description: ['']
            });
        }

        if (this.mode === 'edit') {
            this.form = this.fb.group({
                tenant_type_name: [this.tenantType?.tenant_type_name, [Validators.required,
                    Validators.minLength(3)]],
                tenant_type_display_name: [this.tenantType?.tenant_type_display_name],
                tenant_type_description: [this.tenantType?.tenant_type_description]
            });
        }
    }

    /**
     * Create member
     */
    create() {
        this.errorInForm.next(false);

        const body = Object.assign({}, this.tenantType, this.form.value);

        this.loader = true;

        this.tenantTypeEntityService.add(body).subscribe((data) => {
                this.onSaveComplete();
                this.notification.showNotification('success', 'Success !! TenantType created.');
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
    update() {
        const body = Object.assign({}, this.tenantType, this.form.value);
        delete body.membership_form;

        this.loader = true;
        this.errorInForm.next(false);

        this.tenantTypeEntityService.update(body).subscribe((data) => {
                this.loader = false;

                this.dialogRef.close(this.form.value);

                // notify success
                this.notification.showNotification('success', 'Success !! TenantType has been updated.');

            },
            (error) => {
                this.loader = false;
                this.errorInForm.next(true);
               // this.formError$.subscribe(subscriber => {subscriber.next(true)});

                if (error.tenantType === 0) {
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

    /**
     * Create or Update Data
     */
    createOrUpdate() {
        switch (this.mode) {
            case 'edit' : {
                this.update();
            }
                break;
            case 'add' : {
                this.create();
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

