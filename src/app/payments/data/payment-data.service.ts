import { Injectable } from '@angular/core';
import { PaymentModel } from '../models/payment-model';
import { HttpClient } from '@angular/common/http';
import { AppHttpUrlGenerator } from '../../core/app-http-url-generator';
import { BaseDataService } from '../../shared/services/base-data.service';

@Injectable({ providedIn: 'root' })
export class PaymentDataService extends BaseDataService<PaymentModel> {

    constructor(http: HttpClient, httpUrlGenerator?: AppHttpUrlGenerator) {
         super('UtilityBill', 'utility_bills', http, httpUrlGenerator);
    }
}
