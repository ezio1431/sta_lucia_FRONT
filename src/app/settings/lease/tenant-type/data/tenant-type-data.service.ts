import { Injectable } from '@angular/core';
import { TenantTypeModel } from '../model/tenant-type-model';
import { HttpClient } from '@angular/common/http';
import { BaseDataService } from '../../../../shared/services/base-data.service';
import { AppHttpUrlGenerator } from '../../../../core/app-http-url-generator';

@Injectable({ providedIn: 'root' })
export class TenantTypeDataService extends BaseDataService<TenantTypeModel> {

    constructor(http: HttpClient, httpUrlGenerator?: AppHttpUrlGenerator) {
         super('TenantType', 'tenant_types', http, httpUrlGenerator);
    }
}
