import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilityBillEntityService } from './utility-bill-entity.service';
import { filter, first, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UtilityBillResolverService implements Resolve<boolean> {

    constructor(private utilityBillService: UtilityBillEntityService) {}

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
