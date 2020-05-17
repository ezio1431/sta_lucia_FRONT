import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserSettingModel } from '../../model/user-setting.model';
import { UserSettingService } from '../../data/user-setting.service';
import { NotificationService } from '../../../../shared/notification.service';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
    selector: 'robi-edit-user',
    styles: [],
    templateUrl: './edit-property.component.html'
})

export class EditPropertyComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    user: UserSettingModel;

    loader = false;

    roles: any = [];
    employees: any = [];
    branches: any = [];

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private userService: UserSettingService,
                private notification: NotificationService,
    private dialogRef: MatDialogRef<EditPropertyComponent>) {

        this.user = row.user;
        this.roles = row.roles;
        this.employees = row.employees;
        this.branches = row.branches;

    }

    ngOnInit() {

        this.form = this.fb.group({
            branch_id: [this.user.branch_id, [Validators.required,
                Validators.minLength(3)]],
            first_name: [this.user.first_name, [Validators.required,
                Validators.minLength(3)]],
            middle_name: [this.user.middle_name],
            last_name: [this.user.last_name, [Validators.required,
                Validators.minLength(3)]],
            role_id: [this.user.role_id],
            email: [this.user.email],
            password: [''],
            password_confirmation: [''],
        });
    }

    close() {
        this.dialogRef.close();
    }

    addDialog() {}

    updateUser() {
        const body = Object.assign({}, this.user, this.form.value);

        this.loader = true;
        this.userService.update(body)
            .subscribe((data) => {
                    this.loader = false;
                    this.dialogRef.close(this.form.value);

                    // notify success
                    this.notification.showNotification('success', 'Success !! User has been updated.');
                    setTimeout(() => {
                        this.notification.showNotification('success', 'Action !! Login to continue ...');
                    }, 1000);

                },
                (error) => {
                    this.loader = false;
                    if (error.user === 0) {
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
