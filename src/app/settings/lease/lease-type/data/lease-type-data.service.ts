import { Injectable } from '@angular/core';
import { LeaseTypeModel } from '../model/lease-type-model';
import { HttpClient } from '@angular/common/http';
import { BaseDataService } from '../../../../shared/services/base-data.service';
import { AppHttpUrlGenerator } from '../../../../core/app-http-url-generator';

@Injectable({ providedIn: 'root' })
export class LeaseTypeDataService extends BaseDataService<LeaseTypeModel> {

    constructor(http: HttpClient, httpUrlGenerator?: AppHttpUrlGenerator) {
         super('LeaseType', 'lease_types', http, httpUrlGenerator);
    }
}
