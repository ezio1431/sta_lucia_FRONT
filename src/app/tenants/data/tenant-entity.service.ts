import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { TenantModel } from '../models/tenant-model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TenantEntityService extends EntityCollectionServiceBase <TenantModel> {

    private selectedSource = new BehaviorSubject<TenantModel | null>(null);
    selectedOption$ = this.selectedSource.asObservable();

    meta$: Observable<{}>;

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('Tenant', serviceElementsFactory);

        this.meta$ = this.selectors$['meta$'];
    }

    changeSelectedProperty(selected: TenantModel | null ): void {
        this.selectedSource.next(selected);
    }
}

