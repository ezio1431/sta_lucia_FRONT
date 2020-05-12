import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../../shared/notification.service';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
    selector: 'robi-edit-user',
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

       /* this.roles = row.roles;
        this.employees = row.employees;
        this.branches = row.branches;*/

    }

    ngOnInit() {

      /*  this.form = this.fb.group({
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
        });*/
    }

    close() {
        this.dialogRef.close();
    }

    addDialog() {}

    updateUser() {
    }

}
