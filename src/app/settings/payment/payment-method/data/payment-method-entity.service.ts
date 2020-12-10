import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { PaymentMethodModel } from '../model/payment-method-model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentMethodEntityService extends EntityCollectionServiceBase <PaymentMethodModel> {

    private selectedSource = new BehaviorSubject<PaymentMethodModel | null>(null);
    selectedChanges$ = this.selectedSource.asObservable();

    meta$: any;

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('PaymentMethod', serviceElementsFactory);

     //   this.meta$ = this.selectors$['meta$'];
        this.meta$ = this.selectors$;

        console.log('xxxx_META$', this.meta$);
    }

    changeSelected(selected: PaymentMethodModel | null ): void {
        this.selectedSource.next(selected);
    }
}

