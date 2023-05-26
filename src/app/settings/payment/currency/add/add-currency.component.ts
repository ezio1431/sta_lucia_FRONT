import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import {CurrencySettingModel} from '../model/currency-setting.model';
import {CurrencySettingService} from '../data/currency-setting.service';
import {TranslateService} from '@ngx-translate/core';
import * as _moment from 'moment';
import { ConfirmationDialogComponent } from '../../../../shared/delete/confirmation-dialog-component';
import { AppState } from '../../../../reducers';
import { NotificationService } from '../../../../core/core.module';
const moment =  _moment;

@Component({
    selector: 'robi-add-currency',
    styles: [],
    templateUrl: './add-currency.component.html'
})

export class AddCurrencyComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;
    private errorInForm = new BehaviorSubject<boolean>(false);
    formError$ = this.errorInForm.asObservable();

    currency: CurrencySettingModel;

    loader = false;

    roles: any = [];
    employees: any = [];
    branches: any = [];
    isAdd: boolean;
  deleteDialogRef: MatDialogRef<ConfirmationDialogComponent>;


    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private store: Store<AppState>,
                private fb: FormBuilder,
                private dialog: MatDialog,
                private currencyService: CurrencySettingService,
                private translateService: TranslateService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<AddCurrencyComponent>) {
        this.roles = row.roles;
        this.employees = row.employees;
        this.branches = row.branches;
        this.isAdd = row.isAdd;
        this.currency = row.currency;
    }

    ngOnInit() {

        if (this.isAdd) {
            this.form = this.fb.group({
              country: ['', [Validators.required,
                    Validators.minLength(3)]],
              name: [''],
              code: ['', [Validators.required]],
              symbol: [''],
              thousand_separator: [''],
              decimal_separator: [''],
              date: [moment()],
              rate: ['', [Validators.required]],
              for_buying: [false],
              for_selling: [false]
            });
        }

        if (!this.isAdd) {
            this.form = this.fb.group({
              country: [this.currency?.country, [Validators.required]],
              name: [this.currency?.name],
              code: [this.currency?.code, [Validators.required]],
              symbol: [this.currency?.symbol],
              thousand_separator: [this.currency?.thousand_separator],
              decimal_separator: [''],
              date: [this.currency?.date, [Validators.required]],
              rate: [this.currency?.rate],
              for_buying: [this.currency?.for_buying?.status],
              for_selling: [this.currency?.for_selling?.status]
            });
        }
    }

    /**
     * Create member
     */
    create() {
        this.errorInForm.next(false);
        const body = Object.assign({}, this.currency, this.form.value);
        this.loader = true;
        this.currencyService.create(body).subscribe((data) => {
                this.onSaveComplete();
            this.notification.success(this.translateService.instant('settings.payments.notify.create.success'));
          },
            (error) => {
                this.errorInForm.next(true);
                this.loader = false;
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
        const body = Object.assign({}, this.currency, this.form.value);
        this.loader = true;
        this.errorInForm.next(false);
        this.currencyService.update(body).subscribe((data) => {
                this.loader = false;
                this.dialogRef.close(this.form.value);
            this.notification.success(this.translateService.instant('settings.payments.notify.update.success'));
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

    save() {
        this.dialogRef.close(this.form.value);
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

  openConfirmationDialog(currency: CurrencySettingModel) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {title: this.translateService.instant('settings.payments.notify.delete.confirm')};

    this.deleteDialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    this.deleteDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.delete(currency);
      }
      this.deleteDialogRef = null;
    });
  }

  private delete(currency: CurrencySettingModel) {
    this.loader = true;
    this.currencyService.delete(currency)
      .subscribe((data) => {
          this.loader = false;
          this.onSaveComplete();
          this.notification.success(this.translateService.instant('settings.payments.notify.delete.success'));
        },
        (error) => {
          this.loader = false;
          if (error.error['message']) {
            this.notification.error(error.error['message']);
          } else {
            this.notification.error(this.translateService.instant('settings.payments.notify.delete.error'));
          }
        });
  }

}
