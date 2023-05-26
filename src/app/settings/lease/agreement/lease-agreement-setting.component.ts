import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsState } from '../../../core/settings/settings.model';
import { ActivatedRoute } from '@angular/router';
import { LeaseAgreementSettingModel } from './model/lease-agreement-setting.model';
import { ThemePalette } from '@angular/material/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {of, ReplaySubject, Subject} from 'rxjs';
import {debounceTime, delay, distinctUntilChanged, filter, map, takeUntil, tap} from 'rxjs/operators';
import { LeaseSettingService } from '../general/data/lease-setting.service';
import { NotificationService } from '../../../shared/notification.service';
import { ViewAgreementComponent } from './view/view-agreement.component';
import { LeaseService } from '../../../leases/data/lease.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'robi-lease-general-setting',
    templateUrl: './lease-agreement-setting.component.html',
    styleUrls: ['./lease-agreement-setting.component.css']
})
export class LeaseAgreementSettingComponent implements OnInit {
    form: FormGroup;
    formPreview: FormGroup;
    formErrors: any;

    private loaderInForm = new BehaviorSubject<boolean>(false);
    formLoader$ = this.loaderInForm.asObservable();
    setting: LeaseAgreementSettingModel;
    settings$: Observable<SettingsState>;

    settingId: string;
    invoiceDay: any;


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
    dueON = Array.from({length: (29 - 1)}, (v, k) => k + 1);

    color: ThemePalette = 'accent';
    nextPeriodBilling: boolean;

    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: 'auto',
        minHeight: '0',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        translate: 'yes',
        enableToolbar: true,
        showToolbar: true,
        placeholder: 'Enter text here...',
        defaultParagraphSeparator: '',
        defaultFontName: '',
        defaultFontSize: '',
        fonts: [
            {class: 'arial', name: 'Arial'},
            {class: 'times-new-roman', name: 'Times New Roman'},
            {class: 'calibri', name: 'Calibri'},
            {class: 'comic-sans-ms', name: 'Comic Sans MS'}
        ],
        customClasses: [
            {
                name: 'quote',
                class: 'quote',
            },
            {
                name: 'redText',
                class: 'redText'
            },
            {
                name: 'titleText',
                class: 'titleText',
                tag: 'h1',
            },
        ],
        uploadUrl: 'v1/image',
        uploadWithCredentials: false,
        sanitize: false,
        toolbarPosition: 'top',
        /*toolbarHiddenButtons: [
            ['bold', 'italic'],
            ['fontSize']
        ]*/
    };

    tags$: Observable<string>;

    loader = false;

    /** control for filter for server side. */
    public leaseServerSideFilteringCtrl: FormControl = new FormControl();

    /** indicate search operation is in progress */
    public searching = false;

    /** list of banks filtered after simulating server side search */
    public  filteredServerSideTenants: ReplaySubject<any> = new ReplaySubject<any>(1);

    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

    leasesFiltered$: Observable<any>;
    /**
     * Constructor
     */
    constructor(private fb: FormBuilder,
                private dialog: MatDialog,
                private route: ActivatedRoute,
                private leaseService: LeaseService,
                private leaseSettingService: LeaseSettingService,
                private translateService: TranslateService,
                private notification: NotificationService
    )
    {
        this.form = this.fb.group({
            agreement_body: ['', [Validators.required]]
        });

        this.formPreview = this.fb.group({
            lease: ['', [Validators.required]]
        });
    }

    ngOnInit(): void
    {
        if (this.route.snapshot.data['settings']) {
            this.setting = this.route.snapshot.data['settings'];
            this.prePopulateForm(this.setting);
            // const tags = this.setting?.agreement_tags?.split(',');
            const tags = this.setting?.agreement_tags;
            this.tags$ = of(tags);
        }

        this.leaseServerSideFilteringCtrl.valueChanges
            .pipe(
                filter(search => !!search),
                tap(() => this.searching = true),
                takeUntil(this._onDestroy),
                debounceTime(200),
                distinctUntilChanged(),
                map(search => {
                    search = search.toLowerCase();
                    this.leasesFiltered$ =  this.leaseService.search(search);
                }),
                delay(500)
            )
            .subscribe(filteredTenants => {
                    this.searching = false;
                    this.filteredServerSideTenants.next(filteredTenants);
                },
                error => {
                    this.searching = false;
                });
    }

    /**
     *
     * @param setting
     */
    prePopulateForm(setting: LeaseAgreementSettingModel) {
        this.form.patchValue({
            agreement_body: setting?.agreement_body
        });
    }

    /**
     * Update settings
     */
    update() {
        const body = Object.assign({}, this.setting, this.form.value);

        const formData = new FormData();
        formData.append('id', body.id);

        this.loaderInForm.next(true);
        this.leaseSettingService.update(body)
            .subscribe((data) => {
                    this.loaderInForm.next(false);
                    this.notification.showNotification('success',
                        this.translateService.instant('settings.lease.contract.updated'));
                },
                (error) => {
                    this.loaderInForm.next(false);
                    if (error.payment === 0) {
                        return;
                    }
                    this.formErrors = error;
                    if (this.formErrors) {
                        for (const prop in this.formErrors) {
                            if (this.form) {
                                this.form.controls[prop]?.markAsTouched();
                                this.form.controls[prop].setErrors({incorrect: true});
                            }
                        }
                    }
                });
    }

    /**
     *
     */
    viewAgreement() {
        const bodyData = Object.assign({}, this.setting, this.form.value);

        const formData = new FormData();
        formData.append('id', bodyData.id);
        this.leaseSettingService.update(bodyData)
            .subscribe((data) => {
                    const body = Object.assign({}, this.setting, this.formPreview.value);
                    const dialogConfig = new MatDialogConfig();
                    dialogConfig.disableClose = true;
                    dialogConfig.autoFocus = true;

                    dialogConfig.data = {lease: body?.lease};
                    dialogConfig.minWidth = '80vw';
                    const dialogRef = this.dialog.open(ViewAgreementComponent, dialogConfig);
                    dialogRef.afterClosed().subscribe(
                        (val) => {
                            if ((val)) {
                            }
                        }
                    );
                },
                (error) => {
                    this.loaderInForm.next(false);
                    if (error.payment === 0) {
                        return;
                    }
                    this.formErrors = error;
                    if (this.formErrors) {
                        for (const prop in this.formErrors) {
                            if (this.form) {
                                this.form.controls[prop]?.markAsTouched();
                                this.form.controls[prop].setErrors({incorrect: true});
                            }
                        }
                    }
                });
    }
}
