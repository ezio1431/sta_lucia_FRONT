import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, first, tap, withLatestFrom } from 'rxjs/operators';
import { PageQuery } from '../settings/property/utility/utility-setting.component';
import { select, Store } from '@ngrx/store';
import { selectorUtilityPage } from '../settings/property/utility/data/ulitity-selectors';
import { UtilityEntityService } from '../settings/property/utility/data/utility-entity.service';
import { AmenityEntityService } from '../settings/property/amenity/data/amenity-entity.service';
import { selectAllAmenities, selectorAmenityPage, selectorAmenityPagination } from '../settings/property/amenity/store/amenities.selectors';
import { actionLoadPaginatedAmenities } from '../settings/property/amenity/store/amenity.actions';

export class BaseDataSource implements DataSource<any> {

    private dataSubject = new BehaviorSubject<any[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    private metaSubject = new BehaviorSubject({});
    public meta$ = this.metaSubject.asObservable();

    constructor(private service: any, private store?: Store,
                private utilityEntityService?: UtilityEntityService, private amenityEntityService?: AmenityEntityService) {}

    loadAmenities(page: PageQuery) {
        console.log('loadAmenities');

        const pagination =  this.store.pipe(select(selectorAmenityPagination));

        this.store
            .pipe(
                select(selectorAmenityPage(page)),
                withLatestFrom(pagination),
                tap(([amenities, paginationData]) => {
                    if (amenities.length > 0) {
                        this.dataSubject.next(amenities);
                        this.metaSubject.next(paginationData);
                    } else {
                            console.log('loadAmenities data from server', page);
                        this.store.dispatch(actionLoadPaginatedAmenities({page}));
                    }
                }),
                catchError(() => of([])),
                first()
            ).subscribe();
    }


    loadUtilities(page: PageQuery) {
        this.store
            .pipe(
                select(selectorUtilityPage(page)),
                tap(utilities => {
                    if (utilities.length > 0) {
                        this.dataSubject.next(utilities)
                    } else {
                        if (page.pageIndex === 0) {
                            console.log('getAll data from server', page);
                            this.utilityEntityService.getAll();
                        } else {
                            this.utilityEntityService.getWithQuery({
                                'filter': '',
                                'page': (page.pageIndex + 1).toString(),
                                'limit': (page.pageSize).toString(),
                                'sortField': '',
                                'sortDirection': ''
                            });
                        }
                        console.log('fetched xxx', page);
                    }
                }),
                catchError(() => of([])),
                first()
            ).subscribe();
    }

    /**
     * Load paginated data
     * @param filter
     * @param page
     * @param limit
     * @param sortField
     * @param sortDirection
     * @param whereField
     * @param whereValue
     */
    load(filter: string, page: number, limit: number, sortField: string = '',
         sortDirection: string = '', whereField: string = '', whereValue: string = '') {

        this.loadingSubject.next(true);

        this.service.getAll(filter, page, limit, sortField, sortDirection, whereField, whereValue).pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
            .subscribe((res) => {
                this.dataSubject.next(res['data']);
                this.metaSubject.next(res['meta']);
            } );
    }

    /**
     *
     * @param collectionViewer
     */
    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.dataSubject.asObservable();
    }

    /**
     *
     * @param collectionViewer
     */
    disconnect(collectionViewer: CollectionViewer): void {
        this.dataSubject.complete();
        this.loadingSubject.complete();
    }

}
