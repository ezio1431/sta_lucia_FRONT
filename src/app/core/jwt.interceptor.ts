import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { LocalStorageService } from './local-storage/local-storage.service';
import { AUTH_KEY } from '../authentication/auth.effects';
import { selectSettingsLanguage } from './settings/settings.selectors';
import { selectorLanguage } from '../authentication/authentication.selectors';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    storageKey = 'be3295963d1091720c8513f78f83c216332190ff714a5239c8b49190443be288';
    token: string;
    lang = 'en';
    constructor( private store: Store, private localStorageService: LocalStorageService) {
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.store.pipe(select(selectorLanguage)).subscribe(language => {
            if (typeof language !== 'undefined') {
                this.lang = language;
            }
        });
        const userData = this.localStorageService.getItem(AUTH_KEY);
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${userData?.access_token}`
                }
            });
        const clonedRequest = request.clone({
            headers: request.headers.append('Accept-Language', this.lang)
        });
        return next.handle(clonedRequest);
    }
}
