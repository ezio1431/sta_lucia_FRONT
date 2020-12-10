import { Injectable } from '@angular/core';
import { PaymentFrequencyModel } from '../model/payment-frequency-model';
import { HttpClient } from '@angular/common/http';
import { BaseDataService } from '../../../../shared/services/base-data.service';
import { AppHttpUrlGenerator } from '../../../../core/app-http-url-generator';

@Injectable({ providedIn: 'root' })
export class PaymentFrequencyDataService extends BaseDataService<PaymentFrequencyModel> {

    constructor(http: HttpClient, httpUrlGenerator?: AppHttpUrlGenerator) {
         super('PaymentFrequency', 'payment_frequencies', http, httpUrlGenerator);
    }
}
