import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AmenityEntityService } from './amenity-entity.service';
import { filter, first, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AmenityResolverService implements Resolve<boolean> {

    constructor(private amenityService: AmenityEntityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.amenityService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                         this.amenityService.getAll();
                    }
                }),
               filter(loaded => !!loaded),
               first()
            );
    }
}
