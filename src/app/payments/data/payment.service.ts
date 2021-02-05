import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PaymentModel } from '../models/payment-model';
import { BaseService } from '../../shared/base-service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentService extends BaseService<PaymentModel> {
    private selectedUtilityBillSource = new BehaviorSubject<PaymentModel | null>(null);
    selectedUtilityBillChanges$ = this.selectedUtilityBillSource.asObservable();

    private  localHttpClient: HttpClient;
    constructor(httpClient: HttpClient) {
        super( httpClient, 'payments');
        this.localHttpClient = httpClient;
    }

    changeSelectedUtilityBill(selectedUtilityBill: PaymentModel | null ): void {
        this.selectedUtilityBillSource.next(selectedUtilityBill);
    }


    /**
     * Create a new resource
     * @param item
     */
    public create(item: any): Observable<PaymentModel> {
        return this.localHttpClient.post<any>(super.getResourceUrl(), item);
    }

    /**
     *
     * @param file_path
     */
    getImage(file_path: any): Observable<File> {

        const imageUrl = 'profile_pic';

        const url =  `${super.getResourceUrl()}/${imageUrl}`;

        return this.localHttpClient.post<any>(url, {file_path}, { responseType: 'blob' as 'json'});
    }

    getImagePath(file_path: any): any {

        const imageUrl = 'profile_pic';

        const url =  `${super.getResourceUrl()}/${imageUrl}`;

        return this.localHttpClient.post<any>(url, {file_path}, {});
    }

    /**
     *
     * @param file_path
     */
    public fetchUtilityBillshipForm(file_path: any): Observable<any> {
        const imageUrl = 'membership_form';
        const url =  `${super.getResourceUrl()}/${imageUrl}`;
        return this.localHttpClient.post<any>(url, {file_path}, { responseType: 'blob' as 'json'});
    }

    /**
     * Create a new resource
     * @param item
     */
    public uploadPhoto(item: any): any {
        const itemUrl = 'upload_photo';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }

    /**
     *
     * @param file_path
     */
    public fetchPhoto(file_path: any): Observable<File> {
        const imageUrl = 'fetch_photo';
        const url =  `${super.getResourceUrl()}/${imageUrl}`;
        return this.localHttpClient.post<any>(url, {file_path}, { responseType: 'blob' as 'json'});
    }
}
