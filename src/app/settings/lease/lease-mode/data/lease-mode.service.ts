import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LeaseModeModel } from '../model/lease-mode-model';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class LeaseModeService extends BaseService<LeaseModeModel> {
    private selectedLeaseModeSource = new BehaviorSubject<LeaseModeModel | null>(null);
    selectedLeaseModeChanges$ = this.selectedLeaseModeSource.asObservable();

    private  localHttpClient: HttpClient;
    constructor(httpClient: HttpClient) {
        super( httpClient, 'lease_modes');
        this.localHttpClient = httpClient;
    }

    changeSelectedLeaseMode(selectedLeaseMode: LeaseModeModel | null ): void {
        this.selectedLeaseModeSource.next(selectedLeaseMode);
    }
}
