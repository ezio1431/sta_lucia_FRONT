import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {InvoiceModel} from '../../models/invoice-model';
import {tap} from 'rxjs/operators';
import {PayItemModel} from './pay-item.model';
import { BaseService } from '../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class PayService extends BaseService<InvoiceModel> {

    private  localHttpClient: HttpClient;
    constructor(httpInvoice: HttpClient) {
        super( httpInvoice, 'invoices');
        this.localHttpClient = httpInvoice;
    }

  public payPalPaymentStore(item: any): Observable<any> {
    const itemUrl = 'p_payment_store';
    return this.localHttpClient.post<any>(`${super.getApiUrl()}/${itemUrl}`, item);
  }

  public payPalPaymentSuccess(item: any): Observable<any> {
    const itemUrl = 'p_payment_success';
    return this.localHttpClient.post<any>(`${super.getApiUrl()}/${itemUrl}`, item);
  }

  public payPalPaymentClientAuthorized(item: any): Observable<any> {
    const itemUrl = 'p_payment_client_authorized';
    return this.localHttpClient.post<any>(`${super.getApiUrl()}/${itemUrl}`, item);
  }

  public payPalPaymentError(item: any): Observable<any> {
    const itemUrl = 'p_payment_error';
    return this.localHttpClient.post<any>(`${super.getApiUrl()}/${itemUrl}`, item);
  }

  // Stripe
  public verifyStripePayment(item: any): Observable<any> {
    const itemUrl = 'verify-intent';
    return this.localHttpClient.post<any>(`${super.getApiUrl()}/${itemUrl}`, item);
  }

  addStripePaymentIntent(item: PayItemModel) {
    const url = 'payment-intent';
    return this.localHttpClient.post<any>(`${super.getApiUrl()}/${url}`, JSON.stringify(item), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(tap(resData => {
        console.log(resData);
        return resData;
      }));
  }

  storeStripePaymentIntent(itemIntentData: PayItemModel) {
    const url = 'store-intent';
    return this.localHttpClient.post<any>(`${super.getApiUrl()}/${url}`, JSON.stringify(itemIntentData), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(tap(resData => {
        console.log(resData);
        return resData;
      }));
  }
}
