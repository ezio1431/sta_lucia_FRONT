import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LeaseModeEntityService } from './lease-mode-entity.service';
import { filter, first, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LeaseModeResolverService implements Resolve<boolean> {

    constructor(private leaseModeService: LeaseModeEntityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.leaseModeService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                         this.leaseModeService.getAll();
                    }
                }),
               filter(loaded => !!loaded),
               first()
            );
    }
}
