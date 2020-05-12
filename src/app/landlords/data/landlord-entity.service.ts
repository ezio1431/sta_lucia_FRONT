import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { LandlordModel } from '../models/landlord-model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LandlordEntityService extends EntityCollectionServiceBase <LandlordModel> {

    private selectedLandlordSource = new BehaviorSubject<LandlordModel | null>(null);
    selectedLandlordChanges$ = this.selectedLandlordSource.asObservable();

    meta$: Observable<{}>;

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('Landlord', serviceElementsFactory);

        this.meta$ = this.selectors$['meta$'];
    }

    changeSelectedLandlord(selectedLandlord: LandlordModel | null ): void {
        this.selectedLandlordSource.next(selectedLandlord);
    }
}

