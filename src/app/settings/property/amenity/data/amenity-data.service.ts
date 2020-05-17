import { Injectable } from '@angular/core';
import { AmenityModel } from '../model/amenity-model';
import { HttpClient } from '@angular/common/http';
import { BaseDataService } from '../../../../shared/services/base-data.service';
import { AppHttpUrlGenerator } from '../../../../core/app-http-url-generator';

@Injectable({ providedIn: 'root' })
export class AmenityDataService extends BaseDataService<AmenityModel> {

    constructor(http: HttpClient, httpUrlGenerator?: AppHttpUrlGenerator) {
         super('Amenity', 'amenities', http, httpUrlGenerator);
    }
}
