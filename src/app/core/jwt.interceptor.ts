import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { selectorAccessToken, selectorUserId } from '../authentication/auth.selectors';
import { LocalStorageService } from './local-storage/local-storage.service';
import { AUTH_KEY } from '../authentication/auth.effects';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    storageKey = 'be3295963d1091720c8513f78f83c216332190ff714a5239c8b49190443be288';

    token: string;

    constructor( private store: Store, private localStorageService: LocalStorageService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

       // this.store.pipe(select(selectorAccessToken)).subscribe(token => this.token = token);

      // const userData = JSON.parse(localStorage.getItem(this.storageKey));

        const userData = this.localStorageService.getItem(AUTH_KEY);

      //  console.log('userData', userData?.access_token);

            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${userData?.access_token}`
                }
            });

        return next.handle(request);
    }
}
