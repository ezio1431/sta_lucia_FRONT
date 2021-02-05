import { Injectable } from '@angular/core';
import { InvoiceModel } from '../models/invoice-model';
import { HttpClient } from '@angular/common/http';
import { AppHttpUrlGenerator } from '../../core/app-http-url-generator';
import { BaseDataService } from '../../shared/services/base-data.service';

@Injectable({ providedIn: 'root' })
export class InvoiceDataService extends BaseDataService<InvoiceModel> {

    constructor(http: HttpClient, httpUrlGenerator?: AppHttpUrlGenerator) {
         super('UtilityBill', 'utility_bills', http, httpUrlGenerator);
    }
}
