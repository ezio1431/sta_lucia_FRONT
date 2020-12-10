import { Injectable } from '@angular/core';
import { PaymentMethodModel } from '../model/payment-method-model';
import { HttpClient } from '@angular/common/http';
import { BaseDataService } from '../../../../shared/services/base-data.service';
import { AppHttpUrlGenerator } from '../../../../core/app-http-url-generator';

@Injectable({ providedIn: 'root' })
export class PaymentMethodDataService extends BaseDataService<PaymentMethodModel> {

    constructor(http: HttpClient, httpUrlGenerator?: AppHttpUrlGenerator) {
         super('PaymentMethod', 'payment_methods', http, httpUrlGenerator);
    }
}
