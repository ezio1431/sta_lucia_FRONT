import { Injectable } from '@angular/core';
import { LeaseModel } from '../models/lease-model';
import { HttpClient } from '@angular/common/http';
import { AppHttpUrlGenerator } from '../../core/app-http-url-generator';
import { BaseDataService } from '../../shared/services/base-data.service';

@Injectable({ providedIn: 'root' })
export class LeaseDataService extends BaseDataService<LeaseModel> {

    constructor(http: HttpClient, httpUrlGenerator?: AppHttpUrlGenerator) {
         super('Lease', 'leases', http, httpUrlGenerator);
    }
}
