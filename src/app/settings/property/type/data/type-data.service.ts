import { Injectable } from '@angular/core';
import { TypeModel } from '../model/type-model';
import { HttpClient } from '@angular/common/http';
import { BaseDataService } from '../../../../shared/services/base-data.service';
import { AppHttpUrlGenerator } from '../../../../core/app-http-url-generator';

@Injectable({ providedIn: 'root' })
export class TypeDataService extends BaseDataService<TypeModel> {

    constructor(http: HttpClient, httpUrlGenerator?: AppHttpUrlGenerator) {
         super('PropertyType', 'property_types', http, httpUrlGenerator);
    }
}
