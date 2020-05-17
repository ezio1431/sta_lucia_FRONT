import { Injectable } from '@angular/core';
import { TenantModel } from '../models/tenant-model';
import { HttpClient } from '@angular/common/http';
import { AppHttpUrlGenerator } from '../../core/app-http-url-generator';
import { BaseDataService } from '../../shared/services/base-data.service';

@Injectable({ providedIn: 'root' })
export class TenantDataService extends BaseDataService<TenantModel> {

    constructor(http: HttpClient, httpUrlGenerator?: AppHttpUrlGenerator) {
         super('Tenant', 'tenants', http, httpUrlGenerator);
    }
}
