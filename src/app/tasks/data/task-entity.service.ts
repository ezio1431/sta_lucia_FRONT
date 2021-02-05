import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { TaskModel } from '../models/task-model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskEntityService extends EntityCollectionServiceBase <TaskModel> {

    private selectedLandlordSource = new BehaviorSubject<TaskModel | null>(null);
    selectedLandlordChanges$ = this.selectedLandlordSource.asObservable();

    meta$: Observable<{}>;

    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('Landlord', serviceElementsFactory);

        this.meta$ = this.selectors$['meta$'];
    }

    changeSelectedLandlord(selectedLandlord: TaskModel | null ): void {
        this.selectedLandlordSource.next(selectedLandlord);
    }
}

