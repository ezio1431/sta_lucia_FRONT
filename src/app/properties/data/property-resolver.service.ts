import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PropertyEntityService } from './property-entity.service';
import { filter, first, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PropertyResolverService implements Resolve<boolean> {

    constructor(private propertyService: PropertyEntityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.propertyService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                         this.propertyService.getAll();
                    }
                }),
               filter(loaded => !!loaded),
               first()
            );
    }
}
