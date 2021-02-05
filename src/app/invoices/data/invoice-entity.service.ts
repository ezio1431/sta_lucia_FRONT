import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { InvoiceModel } from '../models/invoice-model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InvoiceEntityService extends EntityCollectionServiceBase <InvoiceModel> {

    private selectedSource = new BehaviorSubject<InvoiceModel | null>(null);
    selectedOption$ = this.selectedSource.asObservable();

    meta$: Observable<{}>;

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('UtilityBill', serviceElementsFactory);

        this.meta$ = this.selectors$['meta$'];
    }

    changeSelectedProperty(selected: InvoiceModel | null ): void {
        this.selectedSource.next(selected);
    }
}

