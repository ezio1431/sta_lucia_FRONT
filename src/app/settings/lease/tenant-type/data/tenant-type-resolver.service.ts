import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TenantTypeEntityService } from './tenant-type-entity.service';
import { filter, first, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TenantTypeResolverService implements Resolve<boolean> {

    constructor(private tenantTypeService: TenantTypeEntityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.tenantTypeService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                         this.tenantTypeService.getAll();
                    }
                }),
               filter(loaded => !!loaded),
               first()
            );
    }
}
