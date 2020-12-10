import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { TenantTypeModel } from '../model/tenant-type-model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TenantTypeEntityService extends EntityCollectionServiceBase <TenantTypeModel> {

    private selectedSource = new BehaviorSubject<TenantTypeModel | null>(null);
    selectedChanges$ = this.selectedSource.asObservable();

    meta$: any;

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('TenantType', serviceElementsFactory);

     //   this.meta$ = this.selectors$['meta$'];
        this.meta$ = this.selectors$;

        console.log('xxxx_META$', this.meta$);
    }

    changeSelected(selected: TenantTypeModel | null ): void {
        this.selectedSource.next(selected);
    }
}

