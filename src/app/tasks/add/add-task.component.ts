import { Component, ElementRef, Inject, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatStepper } from '@angular/material/stepper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskModel } from '../models/task-model';
import { TaskService } from '../data/task.service';

import { NotificationService } from '../../shared/notification.service';
import * as moment from 'moment';
import { TaskEntityService } from '../data/task-entity.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
    selector: 'robi-add-member',
    styles: [],
    templateUrl: './add-task.component.html'
})
export class AddTaskComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;
    // formError$: Observable<boolean>;

    private errorInForm = new BehaviorSubject<boolean>(false);
    formError$ = this.errorInForm.asObservable();

    member: TaskModel;

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
    task: TaskModel;

    @ViewChild('stepper', {static: true }) stepper: MatStepper;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private taskService: TaskService,
                private taskEntityService: TaskEntityService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<AddTaskComponent>) {
        this.mode = row.mode;
        this.task = row.task;
    }

    ngOnInit() {

        if (this.mode === 'add') {
            this.form = this.fb.group({
                title: ['', [Validators.required,
                    Validators.minLength(2)]],
                date: [''],
                lease_id: [''],
                property_id: [''],
                unit_id: [''],
                tenant_id: [''],
                task_category: [''],
                priority: [''],
                status: [''],
                description: ['']
            });
        }

        if (this.mode === 'edit') {
            this.form = this.fb.group({
                title: [this.task.title, [Validators.required,
                    Validators.minLength(2)]],
                date: [this.task.date],
                lease_id: [this.task.lease_id],
                property_id: [this.task.property_id],
                unit_id: [this.task.unit_id],
                tenant_id: [this.task.tenant_id],
                task_category: [this.task.task_category],
                priority: [this.task.priority],
                status: [this.task.status],
                description: [this.task.description]
            });
        }
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

        const body = Object.assign({}, this.task, this.form.value);

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

        this.taskService.create(body)
            .subscribe((res) => {
                    console.log('formData');
                    console.log(body);
                    this.notification.showNotification('success', 'Success !! New Task created.');
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

                            if (this.form.controls[prop]) {
                                this.form.controls[prop]?.markAsTouched();
                                this.form.controls[prop].setErrors({incorrect: true});
                            }
                        }
                    }

                });



     /*   this.taskEntityService.add(body).subscribe((data) => {
                this.onSaveComplete();
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

            });*/
    }

    /**
     *
     */
    update() {
        const body = Object.assign({}, this.task, this.form.value);
        delete body.membership_form;

        this.loader = true;
        this.errorInForm.next(false);

        this.taskEntityService.update(body).subscribe((data) => {
                this.loader = false;

                this.dialogRef.close(this.form.value);

                // notify success
                this.notification.showNotification('success', 'Success !! Landlord has been updated.');

            },
            (error) => {
                this.loader = false;
                this.errorInForm.next(true);
               // this.formError$.subscribe(subscriber => {subscriber.next(true)});

                if (error.task === 0) {
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

