import { Injectable } from '@angular/core';
import { PropertyModel } from '../models/property-model';
import { HttpClient } from '@angular/common/http';
import { AppHttpUrlGenerator } from '../../core/app-http-url-generator';
import { BaseDataService } from '../../shared/services/base-data.service';

@Injectable({ providedIn: 'root' })
export class PropertyDataService extends BaseDataService<PropertyModel> {

    constructor(http: HttpClient, httpUrlGenerator?: AppHttpUrlGenerator) {
         super('Property', 'properties', http, httpUrlGenerator);
    }
}
