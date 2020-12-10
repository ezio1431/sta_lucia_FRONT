import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { selectEffectiveTheme } from '../../core/settings/settings.selectors';
import { AuthActions } from '../action-types';
import { selectorIsLoggedIn, selectorScopes } from '../auth.selectors';

@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    returnUrl: string;
    loginError = '';
    loader = false;
    token$: any;

    theme$: Observable<string>;

    loginScopes: any;

    constructor(private fb: FormBuilder, private store: Store, private route: ActivatedRoute,
                private router: Router, private authenticationService: AuthenticationService) {
        this.loginForm = fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.theme$ = this.store.pipe(select(selectEffectiveTheme));

        this.store.dispatch(AuthActions.actionLogout());
       // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/' || 'landlord';
        this.returnUrl = '/';
    }

    /**
     * Fetch email field
     */
    get email() {
        return this.loginForm.get('email');
    }

    /**
     * Fetch password field
     */
    get password() {
        return this.loginForm.get('password');
    }

    /**
     * Login user against api
     */
    login() {
        this.loginError = '';
        this.loader = true;

        this.authenticationService.login(this.email.value, this.password.value)
            .pipe(tap(
                user => {
                    this.loader = false;
                    this.store.dispatch(AuthActions.actionLogin({user}));
                  //  this.token$ = this.store.pipe(select(selectorScopes));

                    this.store.pipe(select(selectorScopes)).subscribe(scopes => {
                        this.loginScopes = scopes;
                       // const landlord = scopes.find(x => x === 'landlord');

                        // We have a landlord
                        if (scopes?.find(x => x === 'landlord')) {
                            this.returnUrl = '/landlord';
                        }
                        // We have a tenant
                        if (scopes?.find(x => x === 'tenant')) {
                            this.returnUrl = '/tenant';
                        } else {
                            //
                        }
                    });

                    this.router.navigate([this.returnUrl]);
                }
            ))
            .subscribe(
                () => {},
                (error) => {
                    console.log(error);
                    if (error.error.message) {
                        this.loginError = error.error.message;
                    } else {
                        this.loginError = 'Server Error. Please try again later.';
                    }
                    this.loader = false;
                });
    }
}
