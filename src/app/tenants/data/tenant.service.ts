import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TenantModel } from '../models/tenant-model';
import { BaseService } from '../../shared/base-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserProfileModel } from '../../user-profile/model/user-profile.model';

@Injectable({ providedIn: 'root' })
export class TenantService extends BaseService<TenantModel> {
    private selectedTenantSource = new BehaviorSubject<TenantModel | null>(null);
    selectedTenantChanges$ = this.selectedTenantSource.asObservable();

    private  localHttpClient: HttpClient;
    constructor(httpClient: HttpClient) {
        super( httpClient, 'tenants');
        this.localHttpClient = httpClient;
    }

    changeSelectedTenant(selectedTenant: TenantModel | null ): void {
        this.selectedTenantSource.next(selectedTenant);
    }


    /**
     * Create a new resource
     * @param item
     */
    public create(item: any): Observable<TenantModel> {
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
     * @param item
     */
    public updateTenantshipForm(item: any): Observable<UserProfileModel> {
        const itemUrl = 'membership_form_update';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }

    /**
     *
     * @param file_path
     */
    public fetchTenantshipForm(file_path: any): Observable<any> {
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
