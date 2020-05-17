import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TypeEntityService } from './type-entity.service';
import { filter, first, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TypeResolverService implements Resolve<boolean> {

    constructor(private amenityService: TypeEntityService) {}

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
