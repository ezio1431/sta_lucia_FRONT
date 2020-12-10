import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TenantEntityService } from './tenant-entity.service';
import { filter, first, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TenantResolverService implements Resolve<boolean> {

    constructor(private tenantService: TenantEntityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.tenantService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                         this.tenantService.getAll();
                    }
                }),
               filter(loaded => !!loaded),
               first()
            );
    }
}
