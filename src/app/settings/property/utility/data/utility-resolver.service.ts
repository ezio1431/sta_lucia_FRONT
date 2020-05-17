import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilityEntityService } from './utility-entity.service';
import { filter, first, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UtilityResolverService implements Resolve<boolean> {

    constructor(private utilityService: UtilityEntityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.utilityService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                         this.utilityService.getAll();
                    }
                }),
               filter(loaded => !!loaded),
               first()
            );
    }
}
