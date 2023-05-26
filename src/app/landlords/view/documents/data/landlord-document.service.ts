import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { BaseService } from '../../../../shared/base-service';
import { AppState } from '../../../../reducers';
import { LandlordDocumentModel } from '../models/landlord-document-model';

@Injectable({ providedIn: 'root' })
export class LandlordDocumentService extends BaseService<LandlordDocumentModel> {

    private  localHttpClient: HttpClient;
    constructor(httpClient: HttpClient, private store: Store<AppState>) {
        super( httpClient, 'landlord_documents');
        this.localHttpClient = httpClient;
    }

    /**
     * @param item
     */
    public uploadDocument(item: any): Observable<any> {
        const itemUrl = 'upload';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }

    /**
     * @param id
     */
    public fetchDocument(id: string): Observable<any> {
        const imageUrl = 'download_document';
        const url =  `${super.getResourceUrl()}/${imageUrl}`;
        return this.localHttpClient.post<any>(url, {id}, { responseType: 'blob' as 'json'});
    }

    /**
     * @param item
     */
    search(item: any): Observable<any> {
        const imageUrl = 'search';
        const url =  `${super.getResourceUrl()}/${imageUrl}`;
        return this.localHttpClient.post<any>(url, {filter: item});
    }
}
