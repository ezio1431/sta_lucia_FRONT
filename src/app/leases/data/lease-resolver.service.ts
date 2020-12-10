import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LeaseEntityService } from './lease-entity.service';
import { filter, first, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LeaseResolverService implements Resolve<boolean> {

    constructor(private leaseService: LeaseEntityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.leaseService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                         this.leaseService.getAll();
                    }
                }),
               filter(loaded => !!loaded),
               first()
            );
    }
}
