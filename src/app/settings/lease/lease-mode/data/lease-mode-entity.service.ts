import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { LeaseModeModel } from '../model/lease-mode-model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LeaseModeEntityService extends EntityCollectionServiceBase <LeaseModeModel> {

    private selectedSource = new BehaviorSubject<LeaseModeModel | null>(null);
    selectedChanges$ = this.selectedSource.asObservable();

    meta$: any;

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('LeaseMode', serviceElementsFactory);

     //   this.meta$ = this.selectors$['meta$'];
        this.meta$ = this.selectors$;

        console.log('xxxx_META$', this.meta$);
    }

    changeSelected(selected: LeaseModeModel | null ): void {
        this.selectedSource.next(selected);
    }
}

