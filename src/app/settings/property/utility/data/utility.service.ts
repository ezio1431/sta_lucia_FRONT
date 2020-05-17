import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilityModel } from '../model/utility-model';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class UtilityService extends BaseService<UtilityModel> {
    private selectedMemberSource = new BehaviorSubject<UtilityModel | null>(null);
    selectedMemberChanges$ = this.selectedMemberSource.asObservable();

    private  localHttpClient: HttpClient;
    constructor(httpClient: HttpClient) {
        super( httpClient, 'landlords');
        this.localHttpClient = httpClient;
    }

    changeSelectedMember(selectedMember: UtilityModel | null ): void {
        this.selectedMemberSource.next(selectedMember);
    }
}
