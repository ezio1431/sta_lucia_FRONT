import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PaymentMethodModel } from '../model/payment-method-model';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class PaymentMethodService extends BaseService<PaymentMethodModel> {
    private selectedPaymentMethodSource = new BehaviorSubject<PaymentMethodModel | null>(null);
    selectedPaymentMethodChanges$ = this.selectedPaymentMethodSource.asObservable();

    private  localHttpClient: HttpClient;
    constructor(httpClient: HttpClient) {
        super( httpClient, 'payment_methods');
        this.localHttpClient = httpClient;
    }

    changeSelectedPaymentMethod(selectedPaymentMethod: PaymentMethodModel | null ): void {
        this.selectedPaymentMethodSource.next(selectedPaymentMethod);
    }
}
