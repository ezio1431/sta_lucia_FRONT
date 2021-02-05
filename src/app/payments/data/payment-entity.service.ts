import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { PaymentModel } from '../models/payment-model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentEntityService extends EntityCollectionServiceBase <PaymentModel> {

    private selectedSource = new BehaviorSubject<PaymentModel | null>(null);
    selectedOption$ = this.selectedSource.asObservable();

    meta$: Observable<{}>;

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('UtilityBill', serviceElementsFactory);

        this.meta$ = this.selectors$['meta$'];
    }

    changeSelectedProperty(selected: PaymentModel | null ): void {
        this.selectedSource.next(selected);
    }
}

