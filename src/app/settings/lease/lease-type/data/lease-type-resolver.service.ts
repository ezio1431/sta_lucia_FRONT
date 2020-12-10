import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LeaseTypeEntityService } from './lease-type-entity.service';
import { filter, first, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LeaseTypeResolverService implements Resolve<boolean> {

    constructor(private leaseTypeService: LeaseTypeEntityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.leaseTypeService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                         this.leaseTypeService.getAll();
                    }
                }),
               filter(loaded => !!loaded),
               first()
            );
    }
}
