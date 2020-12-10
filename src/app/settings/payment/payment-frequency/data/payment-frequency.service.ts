import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PaymentFrequencyModel } from '../model/payment-frequency-model';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class PaymentFrequencyService extends BaseService<PaymentFrequencyModel> {
    private selectedPaymentFrequencySource = new BehaviorSubject<PaymentFrequencyModel | null>(null);
    selectedPaymentFrequencyChanges$ = this.selectedPaymentFrequencySource.asObservable();

    private  localHttpClient: HttpClient;
    constructor(httpClient: HttpClient) {
        super( httpClient, 'payment_frequencies');
        this.localHttpClient = httpClient;
    }

    changeSelectedPaymentFrequency(selectedPaymentFrequency: PaymentFrequencyModel | null ): void {
        this.selectedPaymentFrequencySource.next(selectedPaymentFrequency);
    }
}
