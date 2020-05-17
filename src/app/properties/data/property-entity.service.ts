import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { PropertyModel } from '../models/property-model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PropertyEntityService extends EntityCollectionServiceBase <PropertyModel> {

    private selectedSource = new BehaviorSubject<PropertyModel | null>(null);
    selectedChanges$ = this.selectedSource.asObservable();

    meta$: Observable<{}>;

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('Property', serviceElementsFactory);

        this.meta$ = this.selectors$['meta$'];
    }

    changeSelectedLandlord(selected: PropertyModel | null ): void {
        this.selectedSource.next(selected);
    }
}

