import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PaymentFrequencyEntityService } from './payment-frequency-entity.service';
import { filter, first, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PaymentFrequencyResolverService implements Resolve<boolean> {

    constructor(private paymentFrequencyService: PaymentFrequencyEntityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.paymentFrequencyService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                         this.paymentFrequencyService.getAll();
                    }
                }),
               filter(loaded => !!loaded),
               first()
            );
    }
}
