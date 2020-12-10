import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AmenityEntityService } from './amenity-entity.service';
import { filter, finalize, first, map, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { actionLoadPaginatedAmenities, loadAllAmenities } from '../store/amenity.actions';
import { PageQuery } from '../../utility/utility-setting.component';
import { selectorAmenityPage } from '../store/amenities.selectors';

@Injectable({ providedIn: 'root' })
export class AmenityResolverService implements Resolve<boolean> {

    loading = false;

    constructor(private amenityService: AmenityEntityService, private store: Store) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

        /*return this.amenityService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                         this.amenityService.getAll();
                    }
                }),
               filter(loaded => !!loaded),
               first()
            );*/
        const initialPage: PageQuery = {
            pageIndex: 0,
            pageSize: 3
        };

        return this.store
            .pipe(
                select(selectorAmenityPage(initialPage)),
                tap(amenities => {
                    console.log('at reolver...amenities');
                    console.log(amenities);
                    if (!this.loading) {
                        this.loading = true;
                        this.store.dispatch(actionLoadPaginatedAmenities({page: initialPage}));
                    }
                }),
                first(),
                finalize(() => this.loading = false )
            )

       /* return this.store
            .pipe(
                select(selectorAmenityPage(initialPage)),
                tap(amenities => {
                    console.log('at reolver...amenities');
                    console.log(amenities);
                    if (amenities.length === 0) {
                        this.store.dispatch(actionLoadPaginatedAmenities({page: initialPage}));
                    }
                }),
                filter(amenities => !!amenities),
                first()
            )*/

       /* return this.store
            .pipe(
                tap(() => {
                    if (!this.loading) {
                        this.loading = true;
                        this.store.dispatch(loadAllAmenities());
                    }
                }),
                first(),
                finalize(() => this.loading = false)
            );*/


    }
}
