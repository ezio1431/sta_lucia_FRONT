import { Routes, RouterModule } from '@angular/router';
import { TaskComponent } from './task.component';
import { AddTaskComponent } from './add/add-task.component';
import { TaskResolverService } from './data/task-resolver.service';
import { ViewTaskComponent } from './view/view-task.component';
import { ViewTaskGeneralComponent } from './view/general/view-task-general.component';
import { TaskDocumentComponent } from './view/documents/task-document.component';
import { TaskPropertyComponent } from './view/property/task-property.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: TaskComponent,
        resolve: {
            landlords: TaskResolverService
        }
    },
    {
        path: ':id',
        component: ViewTaskComponent,
        /*resolve : { member: LandlordResolverService},*/
        children: [
            { path: '', component: ViewTaskGeneralComponent },
            { path: 'documents', component: TaskDocumentComponent },
            { path: 'properties', component: TaskPropertyComponent }
        ]
    },
    { path: 'create', component: AddTaskComponent },
];


export const TaskRoutingModule = RouterModule.forChild(ROUTES);
