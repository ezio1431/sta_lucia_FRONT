import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../shared/base-service';
import { UserSettingModel } from '../model/user-setting.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserSettingService extends BaseService<UserSettingModel> {
    private  localHttpClient: HttpClient;
    constructor(httpClient: HttpClient) {
        super( httpClient, 'users');
        this.localHttpClient = httpClient;
    }

    /**
     *
     * @param email
     */
    public forgotPassword(email: any): Observable<any> {
        const itemUrl = 'forgot_password';
        return this.localHttpClient.post<any>(`${super.getApiUrl()}/${itemUrl}`, email);
    }

    /**
     *
     * @param item
     */
    public resetPassword(item: any): Observable<any> {
        const itemUrl = 'reset_password';
        return this.localHttpClient.post<any>(`${super.getApiUrl()}/${itemUrl}`, item);
    }
}
