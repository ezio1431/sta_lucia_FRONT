import { Injectable } from '@angular/core';
import { UtilityModel } from '../model/utility-model';
import { HttpClient } from '@angular/common/http';
import { BaseDataService } from '../../../../shared/services/base-data.service';
import { AppHttpUrlGenerator } from '../../../../core/app-http-url-generator';

@Injectable({ providedIn: 'root' })
export class UtilityDataService extends BaseDataService<UtilityModel> {

    constructor(http: HttpClient, httpUrlGenerator?: AppHttpUrlGenerator) {
         super('Utility', 'utilities', http, httpUrlGenerator);
    }
}
