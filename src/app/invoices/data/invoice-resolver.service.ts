import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { InvoiceEntityService } from './invoice-entity.service';
import { filter, first, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class InvoiceResolverService implements Resolve<boolean> {

    constructor(private utilityBillService: InvoiceEntityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.utilityBillService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                         this.utilityBillService.getAll();
                    }
                }),
               filter(loaded => !!loaded),
               first()
            );
    }
}
