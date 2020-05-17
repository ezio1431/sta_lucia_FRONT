import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AmenityModel } from '../model/amenity-model';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class AmenityService extends BaseService<AmenityModel> {
    private selectedMemberSource = new BehaviorSubject<AmenityModel | null>(null);
    selectedMemberChanges$ = this.selectedMemberSource.asObservable();

    private  localHttpClient: HttpClient;
    constructor(httpClient: HttpClient) {
        super( httpClient, 'amenities');
        this.localHttpClient = httpClient;
    }

    changeSelectedMember(selectedMember: AmenityModel | null ): void {
        this.selectedMemberSource.next(selectedMember);
    }
}
