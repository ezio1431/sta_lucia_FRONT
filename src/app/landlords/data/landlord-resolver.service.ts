import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LandlordEntityService } from './landlord-entity.service';
import { filter, first, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LandlordResolverService implements Resolve<boolean> {

    constructor(private landlordService: LandlordEntityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.landlordService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                         this.landlordService.getAll();
                    }
                }),
               filter(loaded => !!loaded),
               first()
            );
    }
}
