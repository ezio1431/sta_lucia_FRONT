import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UnitTypeEntityService } from './unit-type-entity.service';
import { filter, first, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UnitTypeResolverService implements Resolve<boolean> {

    constructor(private unitTypeService: UnitTypeEntityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.unitTypeService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                         this.unitTypeService.getAll();
                    }
                }),
               filter(loaded => !!loaded),
               first()
            );
    }
}
