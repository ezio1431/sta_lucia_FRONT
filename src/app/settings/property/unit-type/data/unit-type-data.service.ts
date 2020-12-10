import { Injectable } from '@angular/core';
import { UnitTypeModel } from '../model/unit-type-model';
import { HttpClient } from '@angular/common/http';
import { BaseDataService } from '../../../../shared/services/base-data.service';
import { AppHttpUrlGenerator } from '../../../../core/app-http-url-generator';

@Injectable({ providedIn: 'root' })
export class UnitTypeDataService extends BaseDataService<UnitTypeModel> {

    constructor(http: HttpClient, httpUrlGenerator?: AppHttpUrlGenerator) {
         super('UnitType', 'unit_types', http, httpUrlGenerator);
    }
}
