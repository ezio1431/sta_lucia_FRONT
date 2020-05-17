import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RoleSettingService } from '../../data/role-setting.service';
import { RoleSettingModel } from '../../model/role-setting-model';
import { NotificationService } from '../../../../shared/notification.service';
import { CheckboxItem } from './check-box-item';

@Component({
    selector: 'app-edit-role',
    styles: [],
    templateUrl: './edit-role.component.html'
})
export class EditRoleComponent implements OnInit  {

    options = Array<CheckboxItem>();
    selectedValues: string[];
    editForm: FormGroup;

    formErrors: any;

    role: RoleSettingModel;


    loader = false;


    @Output() toggle = new EventEmitter<any[]>();
    private finalPermissions: [any];

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private roleService: RoleSettingService,
                private notification: NotificationService,
    private dialogRef: MatDialogRef<EditRoleComponent>) {

        this.role = row.role;
        this.options = row.permOptions;
        this.selectedValues = this.role.permissions.map(x => x['id']);

        this.editForm = this.fb.group({
            name: [this.role.name, [Validators.required,
                Validators.minLength(3)]],
            display_name: [this.role.display_name],
            permissions: new FormArray([])
        });
    }

    get items(): FormArray {
        return this.editForm.get('permissions') as FormArray;
    }

    ngOnInit() {

        this.editForm.valueChanges.subscribe(value => {
            const optionsChecked = new Array<any>();
            for (let index = 0; index < this.items.length; index++) {
                const isOptionChecked =
                    this.items.get(index.toString()).value;
                if (isOptionChecked) {
                    const currentOptionValue =
                        this.options[index].value;
                    optionsChecked.push(currentOptionValue);
                }
            }
           this.toggle.emit(optionsChecked);
        });



        if (this.items.length === 0) {

            this.options.forEach(x => {

                this.items.push(new FormControl(false));
            });
        }

        this.selectedValues.forEach(value => {
            const index: number =
                this.options.findIndex(opt => opt.value === value);
            if (index >= 0) {
                this.items.get(index.toString()).setValue(true);
            }
        });
    }

    close() {
        this.dialogRef.close();
    }


    private selectedPermissions() {
        return this.editForm.value.permissions
            .map((v, i) => v ? this.options[i].value : null)
            .filter(v => v !== null);
    }

    update() {
        const body = Object.assign({}, this.role, this.editForm.value);

        this.finalPermissions = this.selectedPermissions();

        body.permissions = this.finalPermissions;

        this.loader = true;
        this.roleService.update(body)
            .subscribe((data) => {
                    this.loader = false;

                    this.dialogRef.close(this.editForm.value);

                    // notify success
                    this.notification.showNotification('success', 'Success !! Role has been updated.');

                },
                (error) => {
                    this.loader = false;
                    if (error.role === 0) {
                        return;
                    }
                    // An array of all form errors as returned by server
                   this.formErrors = error;

                    if (this.formErrors) {
                        // loop through from fields, If has an error, mark as invalid so mat-error can show
                        for (const prop in this.formErrors) {
                            if (this.editForm) {
                                this.editForm.controls[prop].setErrors({incorrect: true});
                            }
                        }
                    }
                });
    }

}
