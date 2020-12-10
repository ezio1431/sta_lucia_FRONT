import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { PaymentFrequencyModel } from '../model/payment-frequency-model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentFrequencyEntityService extends EntityCollectionServiceBase <PaymentFrequencyModel> {

    private selectedSource = new BehaviorSubject<PaymentFrequencyModel | null>(null);
    selectedChanges$ = this.selectedSource.asObservable();

    meta$: any;

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('PaymentFrequency', serviceElementsFactory);

     //   this.meta$ = this.selectors$['meta$'];
        this.meta$ = this.selectors$;

        console.log('xxxx_META$', this.meta$);
    }

    changeSelected(selected: PaymentFrequencyModel | null ): void {
        this.selectedSource.next(selected);
    }
}

