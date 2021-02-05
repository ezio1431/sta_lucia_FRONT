import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LandlordModel } from '../models/landlord-model';
import { BaseService } from '../../shared/base-service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LandlordService extends BaseService<LandlordModel> {
    private selectedLandlordSource = new BehaviorSubject<LandlordModel | null>(null);
    selectedLandlordChanges$ = this.selectedLandlordSource.asObservable();

    private  localHttpClient: HttpClient;
    constructor(httpClient: HttpClient) {
        super( httpClient, 'landlords');
        this.localHttpClient = httpClient;
    }

    changeSelectedLandlord(selectedLandlord: LandlordModel | null ): void {
        this.selectedLandlordSource.next(selectedLandlord);
    }


    /**
     * Create a new resource
     * @param item
     */
    public create(item: any): Observable<LandlordModel> {
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

    /**
     *
     * @param file_path
     */
    public fetchLandlordshipForm(file_path: any): Observable<any> {
        const imageUrl = 'membership_form';
        const url =  `${super.getResourceUrl()}/${imageUrl}`;
        return this.localHttpClient.post<any>(url, {file_path}, { responseType: 'blob' as 'json'});
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
