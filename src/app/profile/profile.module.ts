import { NgModule } from '@angular/core';
import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '../shared/shared.module';
import {
    EntityDataService,
    EntityDefinitionService,
    EntityMetadataMap,
} from '@ngrx/data';
import { ProfileComponent } from './profile.component';

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
        ProfileRoutingModule
    ],
    declarations: [
        ProfileComponent
    ]
})

export class ProfileModule {
    constructor () {
    }
}
