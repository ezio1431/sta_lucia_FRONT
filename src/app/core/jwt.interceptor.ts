import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    storageKey = 'be3295963d1091720c8513f78f83c216332190ff714a5239c8b49190443be288';

    constructor() {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

         request = request.clone({
                setHeaders: {
                    Authorization: `Bearer xxxxxtoken herexxxxx`
                }
            });

        return next.handle(request);
    }
}
