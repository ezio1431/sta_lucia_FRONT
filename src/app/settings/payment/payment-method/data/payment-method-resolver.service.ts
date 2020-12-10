import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PaymentMethodEntityService } from './payment-method-entity.service';
import { filter, first, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PaymentMethodResolverService implements Resolve<boolean> {

    constructor(private paymentMethodService: PaymentMethodEntityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.paymentMethodService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                         this.paymentMethodService.getAll();
                    }
                }),
               filter(loaded => !!loaded),
               first()
            );
    }
}
