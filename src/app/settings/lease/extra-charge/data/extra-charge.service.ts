import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExtraChargeModel } from '../model/extra-charge-model';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class ExtraChargeService extends BaseService<ExtraChargeModel> {
    private selectedExtraChargeSource = new BehaviorSubject<ExtraChargeModel | null>(null);
    selectedExtraChargeChanges$ = this.selectedExtraChargeSource.asObservable();

    private  localHttpClient: HttpClient;
    constructor(httpClient: HttpClient) {
        super( httpClient, 'extra_charges');
        this.localHttpClient = httpClient;
    }

    changeSelectedExtraCharge(selectedExtraCharge: ExtraChargeModel | null ): void {
        this.selectedExtraChargeSource.next(selectedExtraCharge);
    }
}
