import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { AmenityModel } from '../model/amenity-model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AmenityEntityService extends EntityCollectionServiceBase <AmenityModel> {

    private selectedSource = new BehaviorSubject<AmenityModel | null>(null);
    selectedChanges$ = this.selectedSource.asObservable();

    meta$: Observable<{}>;

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('Amenity', serviceElementsFactory);

        this.meta$ = this.selectors$['meta$'];
    }

    changeSelected(selected: AmenityModel | null ): void {
        this.selectedSource.next(selected);
    }
}

