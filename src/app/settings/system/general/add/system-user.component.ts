import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'robi-add-user',
    styles: [],
    templateUrl: './system-user.component.html'
})

export class SystemUserComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    loader = false;

    roles: any = [];
    employees: any = [];
    branches: any = [];

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<SystemUserComponent>) {
        this.roles = row.roles;
        this.employees = row.employees;
        this.branches = row.branches;
    }

    ngOnInit() {

        this.form = this.fb.group({
            branch_id: ['', [Validators.required,
                Validators.minLength(3)]],
            first_name: ['', [Validators.required,
                Validators.minLength(3)]],
            middle_name: [''],
            last_name: ['', [Validators.required,
                Validators.minLength(3)]],
            role_id: [''],
           /* employee_id: [''],*/
            email: [''],
            password: [''],
            password_confirmation: [''],
        });
    }

    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }

    addDialog() {}

    /**
     * Create a resource
     */
    createUser() {
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
