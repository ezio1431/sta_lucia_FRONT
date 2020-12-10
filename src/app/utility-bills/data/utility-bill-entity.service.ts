import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { UtilityBillModel } from '../models/utility-bill-model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UtilityBillEntityService extends EntityCollectionServiceBase <UtilityBillModel> {

    private selectedSource = new BehaviorSubject<UtilityBillModel | null>(null);
    selectedOption$ = this.selectedSource.asObservable();

    meta$: Observable<{}>;

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('UtilityBill', serviceElementsFactory);

        this.meta$ = this.selectors$['meta$'];
    }

    changeSelectedProperty(selected: UtilityBillModel | null ): void {
        this.selectedSource.next(selected);
    }
}

