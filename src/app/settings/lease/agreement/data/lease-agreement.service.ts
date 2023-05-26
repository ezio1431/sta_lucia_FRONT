import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from '../../../../shared/base-service';
import { LeaseAgreementSettingModel } from '../model/lease-agreement-setting.model';

@Injectable({ providedIn: 'root' })
export class LeaseAgreementService extends BaseService<LeaseAgreementSettingModel> {
    private selectedLeaseSettingSource = new BehaviorSubject<LeaseAgreementSettingModel | null>(null);
    selectedLeaseSettingChanges$ = this.selectedLeaseSettingSource.asObservable();

    private  localHttpClient: HttpClient;
    constructor(httpClient: HttpClient) {
        super( httpClient, 'lease_settings');
        this.localHttpClient = httpClient;
    }

    changeSelectedLeaseSetting(selectedLeaseSetting: LeaseAgreementSettingModel | null ): void {
        this.selectedLeaseSettingSource.next(selectedLeaseSetting);
    }
}
