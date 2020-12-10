import { Injectable } from '@angular/core';
import { LeaseModeModel } from '../model/lease-mode-model';
import { HttpClient } from '@angular/common/http';
import { BaseDataService } from '../../../../shared/services/base-data.service';
import { AppHttpUrlGenerator } from '../../../../core/app-http-url-generator';

@Injectable({ providedIn: 'root' })
export class LeaseModeDataService extends BaseDataService<LeaseModeModel> {

    constructor(http: HttpClient, httpUrlGenerator?: AppHttpUrlGenerator) {
         super('LeaseMode', 'lease_modes', http, httpUrlGenerator);
    }
}
