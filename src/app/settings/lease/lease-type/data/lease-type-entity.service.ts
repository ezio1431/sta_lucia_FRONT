import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { LeaseTypeModel } from '../model/lease-type-model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LeaseTypeEntityService extends EntityCollectionServiceBase <LeaseTypeModel> {

    private selectedSource = new BehaviorSubject<LeaseTypeModel | null>(null);
    selectedChanges$ = this.selectedSource.asObservable();

    meta$: any;

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('LeaseType', serviceElementsFactory);

     //   this.meta$ = this.selectors$['meta$'];
        this.meta$ = this.selectors$;

        console.log('xxxx_META$', this.meta$);
    }

    changeSelected(selected: LeaseTypeModel | null ): void {
        this.selectedSource.next(selected);
    }
}

