import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GeneralSettingModel } from './model/general-setting.model';
import { ActivatedRoute } from '@angular/router';
import { GeneralSettingService } from './data/general-setting.service';
import { NotificationService } from '../../shared/notification.service';
import { Observable, of, ReplaySubject, Subject, Subscription } from 'rxjs';
import { SettingsState, State } from '../../core/settings/settings.model';
import { select, Store } from '@ngrx/store';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../core/animations/route.animations';
import {
    actionSettingsChangeAnimationsElements,
    actionSettingsChangeAnimationsPage,
    actionSettingsChangeAutoNightMode,
    actionSettingsChangeLanguage, actionSettingsChangeStickyHeader,
    actionSettingsChangeTheme
} from '../../core/settings/settings.actions';
import { AuthActions, AuthenticationActions } from '../../authentication/action-types';
import { selectorAuthenticatedUser, selectorUserGeneralSettings } from '../../authentication/authentication.selectors';
import { User } from '../../authentication/model/user.model';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, delay, distinctUntilChanged, filter, map, takeUntil, tap } from 'rxjs/operators';
import { CurrencySettingService } from '../payment/currency/data/currency-setting.service';

@Component({
    selector: 'robi-general-setting',
    templateUrl: './general-setting.component.html',
    styleUrls: ['./general-setting.component.css']
})
export class GeneralSettingComponent implements OnInit, OnDestroy {

    form: FormGroup;
    formErrors: any;
    loader = false;

    setting: GeneralSettingModel;

    logoToUpload: File = null;
    logoUrl = '';

    photoToUpload: File = null;
    photoName: any;
    photoUrl = '';
    showPhoto: any;

    settingId: string;

    dateFormats: any;
    amountThousandSeparators: any;
    amountDecimalSeparators: any;
    amountDecimals: any;
    authenticatedUser: User;

    settings$: Observable<SettingsState>;

    themes = [
        { value: 'DEFAULT-THEME', label: 'blue' },
        { value: 'LIGHT-THEME', label: 'light' },
        { value: 'NATURE-THEME', label: 'nature' },
        { value: 'BLACK-THEME', label: 'dark' },
        { value: 'ORANGE-THEME', label: 'orange' },
        { value: 'RED-THEME', label: 'red' },
        { value: 'PURPLE-THEME', label: 'purple' },
        { value: 'GREEN-THEME', label: 'green' },
        { value: 'BROWN-THEME', label: 'brown' },
        { value: 'GREY-THEME', label: 'grey' },
        { value: 'PINK-THEME', label: 'pink' }
    ];

    languages = [
        { value: 'ar', label: 'ar' },
        { value: 'de', label: 'de' },
        { value: 'en', label: 'en' },
        { value: 'es', label: 'es' },
        { value: 'fr', label: 'fr' },
        { value: 'hi', label: 'hi' },
        { value: 'id', label: 'id' },
        { value: 'pt', label: 'pt' },
        { value: 'pt-br', label: 'pt-br' },
        { value: 'ru', label: 'ru' },
        { value: 'sw', label: 'sw' },
        { value: 'zh_CN', label: 'zh_CN' }
        ];

    /** indicate search operation is in progress */
    public searching = false;
    public currencyServerSideFilteringCtrl: FormControl = new FormControl();
    public  filteredServerSideCurrencies: ReplaySubject<any> = new ReplaySubject<any>(1);
    currenciesFiltered$: Observable<any>;
    protected _onDestroy = new Subject<void>();
    selectedCurrencySub = new Subscription();
    currencySymbol: string;
    constructor(private store: Store<State>, private fb: FormBuilder, private route: ActivatedRoute,
                private generalSettingService: GeneralSettingService,
                private translateService: TranslateService,
                private currencyService: CurrencySettingService,
                private notification: NotificationService ) {

        if (this.route.snapshot.data['setting']) {
            this.setting = this.route.snapshot.data['setting'];
            this.currenciesFiltered$ = of([this.setting.currency]);
            this.settingId = this.setting.id;
            // Fetch photo
            this.getImageFromService();

            // Populate select drop down data
            this.dateFormats = this.setting.date_formats;
            this.amountThousandSeparators = this.setting.amount_thousand_separators;
            this.amountDecimalSeparators = this.setting.amount_decimal_separators;
            this.amountDecimals = this.setting.amount_decimals;

            this.form = this.fb.group({
                theme: '',
                language: '',
                company_name: this.setting.company_name,
                email: this.setting.email,
                currency: this.setting?.currency,
                phone: this.setting.phone,
                country: this.setting.country,
                county: this.setting.county,
                town: this.setting.town,
                physical_address: this.setting.physical_address,
                postal_address: this.setting.postal_address,
                postal_code: this.setting.postal_code,
                website_url: this.setting.website_url,
                logo: this.setting.logo,
                date_format: this.setting.date_format,
                amount_thousand_separator: this.setting.amount_thousand_separator,
                amount_decimal_separator: this.setting.amount_decimal_separator,
                amount_decimal: this.setting.amount_decimal
            });
        }
    }

    ngOnInit(): void {
        this.settings$ = this.store.pipe(select(selectorUserGeneralSettings));
        // currency Server Side search
        this.currencyServerSideFilteringCtrl.valueChanges
            .pipe(
                filter(search => !!search),
                tap(() => this.searching = true),
                takeUntil(this._onDestroy),
                debounceTime(200),
                distinctUntilChanged(),
                map(search => {
                    search = search.toLowerCase();
                    this.currenciesFiltered$ =  this.currencyService.search(search);
                }),
                delay(500)
            )
            .subscribe(filteredCurrencies => {
                    this.searching = false;
                    this.filteredServerSideCurrencies.next(filteredCurrencies);
                },
                error => {
                    this.searching = false;
                });
     }

    onLanguageSelect({ value: language }) {
        this.store.dispatch(actionSettingsChangeLanguage({ language }));
        this.update();
    }

    onThemeSelect({ value: theme }) {
        this.store.dispatch(actionSettingsChangeTheme({ theme }));
        this.update();
    }

    onAutoNightModeToggle({ checked: autoNightMode }) {
        this.store.dispatch(actionSettingsChangeAutoNightMode({ autoNightMode }));
    }

    onStickyHeaderToggle({ checked: stickyHeader }) {
        this.store.dispatch(actionSettingsChangeStickyHeader({ stickyHeader }));
    }

    onPageAnimationsToggle({ checked: pageAnimations }) {
        this.store.dispatch(actionSettingsChangeAnimationsPage({ pageAnimations }));
    }

    onElementsAnimationsToggle({ checked: elementsAnimations }) {
        this.store.dispatch(
            actionSettingsChangeAnimationsElements({ elementsAnimations })
        );
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
                    this.notification.showNotification('success',
                        this.translateService.instant('settings.general.notification.logo_updated'));
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

        // update the store
       this.store.pipe(select(selectorAuthenticatedUser)).subscribe(user => {
           const mimi = {...user};
           mimi.g_settings = body;
           this.authenticatedUser = mimi;
       });
       this.store.dispatch(AuthActions.actionLogin({user: this.authenticatedUser}));

        const formData = new FormData();
        formData.append('logo', this.logoToUpload);
        formData.append('id', body.id);

        this.loader = true;
        this.generalSettingService.update(body)
            .subscribe((data) => {
                    this.loader = false;
                    this.notification.showNotification('success',
                        this.translateService.instant('settings.general.notification.setting_updated'));
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

    onCurrencyItemChange(value) {
        this.selectedCurrencySub = this.currencyService.getById(value?.id).subscribe(data => {
            this.currencySymbol = data?.symbol;
        });
        this.update();
    }

    ngOnDestroy() {
        this.selectedCurrencySub.unsubscribe();
    }
}
