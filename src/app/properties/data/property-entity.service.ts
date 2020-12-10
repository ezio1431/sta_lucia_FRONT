import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { PropertyModel } from '../models/property-model';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PropertyEntityService extends EntityCollectionServiceBase <PropertyModel> {

    private selectedSource = new BehaviorSubject<PropertyModel | null>(null);
    selectedOption$ = this.selectedSource.asObservable();

    meta$: Observable<{}>;

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('Property', serviceElementsFactory);

        this.meta$ = this.selectors$['meta$'];
    }

    changeSelectedProperty(selected: PropertyModel | null ): void {
        this.selectedSource.next(selected);
    }
}

