import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { TypeModel } from '../model/type-model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TypeEntityService extends EntityCollectionServiceBase <TypeModel> {

    private selectedSource = new BehaviorSubject<TypeModel | null>(null);
    selectedChanges$ = this.selectedSource.asObservable();

    meta$: Observable<{}>;

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('PropertyType', serviceElementsFactory);

        this.meta$ = this.selectors$['meta$'];
    }

    changeSelected(selected: TypeModel | null ): void {
        this.selectedSource.next(selected);
    }
}

