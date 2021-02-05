import { NgModule } from '@angular/core';
import { TaskRoutingModule } from './task-routing.module';
import { TaskComponent } from './task.component';
import { AddTaskComponent } from './add/add-task.component';
import { SharedModule } from '../shared/shared.module';
import {
    EntityDataService,
    EntityDefinitionService,
    EntityMetadataMap,
} from '@ngrx/data';
import { TaskDataService } from './data/task-data.service';
import { TaskDocumentComponent } from './view/documents/task-document.component';
import { ViewTaskGeneralComponent } from './view/general/view-task-general.component';
import { TaskPropertyComponent } from './view/property/task-property.component';
import { ViewTaskComponent } from './view/view-task.component';

const entityMetaData: EntityMetadataMap = {
    Landlord: {
        additionalCollectionState: {
            meta: {
                current_page: 1,
                from: 1,
                last_page: '',
                path: '',
                per_page: '',
                to: '',
                total: ''
            }
        }
    }
};

@NgModule({
    imports: [
        SharedModule,
        TaskRoutingModule
    ],
    declarations: [
        TaskComponent,
        AddTaskComponent,
        TaskDocumentComponent,
        ViewTaskGeneralComponent,
        TaskPropertyComponent,
        ViewTaskComponent
    ],
    entryComponents: [
        AddTaskComponent
    ]
})

export class TaskModule {

    constructor (private eds: EntityDefinitionService, private entityDataService: EntityDataService,
                 private landlordDataService: TaskDataService) {
        eds.registerMetadataMap(entityMetaData);
        entityDataService.registerService('Landlord', landlordDataService)
    }
}
