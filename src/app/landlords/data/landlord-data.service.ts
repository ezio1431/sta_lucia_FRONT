import { Injectable } from '@angular/core';
import { LandlordModel } from '../models/landlord-model';
import { HttpClient } from '@angular/common/http';
import { AppHttpUrlGenerator } from '../../core/app-http-url-generator';
import { BaseDataService } from '../../shared/services/base-data.service';

@Injectable({ providedIn: 'root' })
export class LandlordDataService extends BaseDataService<LandlordModel> {

    constructor(http: HttpClient, httpUrlGenerator?: AppHttpUrlGenerator) {
         super('Landlord', 'landlords', http, httpUrlGenerator);
    }
}
