import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TypeModel } from '../model/type-model';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class TypeService extends BaseService<TypeModel> {
    private selectedMemberSource = new BehaviorSubject<TypeModel | null>(null);
    selectedMemberChanges$ = this.selectedMemberSource.asObservable();

    private  localHttpClient: HttpClient;
    constructor(httpClient: HttpClient) {
        super( httpClient, 'property_types');
        this.localHttpClient = httpClient;
    }

    changeSelectedMember(selectedMember: TypeModel | null ): void {
        this.selectedMemberSource.next(selectedMember);
    }
}
