import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { UnitTypeModel } from '../model/unit-type-model';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UnitTypeEntityService extends EntityCollectionServiceBase <UnitTypeModel> {

    private selectedSource = new BehaviorSubject<UnitTypeModel | null>(null);
    selectedChanges$ = this.selectedSource.asObservable();

    meta$: any;

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('UnitType', serviceElementsFactory);

     //   this.meta$ = this.selectors$['meta$'];
        this.meta$ = this.selectors$;

        console.log('xxxx_META$', this.meta$);
    }

    changeSelected(selected: UnitTypeModel | null ): void {
        this.selectedSource.next(selected);
    }

    selectEntityById(id: string): Observable<UnitTypeModel> {
        return this.entityMap$.pipe(
            map(entities => entities[id]),
            first());
    }
}

