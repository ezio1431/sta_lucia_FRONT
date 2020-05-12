import { NgModule } from '@angular/core';

import { UserGeneralSettingRoutingModule } from './user-general-setting-routing.module';
import { UserGeneralSettingComponent } from './user-general-setting.component';
import { AddUserComponent } from './add/add-user.component';
import { EditUserComponent } from './edit/edit-user.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        UserGeneralSettingRoutingModule,
    ],
    declarations: [
        UserGeneralSettingComponent,
        AddUserComponent,
        EditUserComponent
    ],
    entryComponents: [
        AddUserComponent,
        EditUserComponent
    ]
})

export class UserGeneralSettingModule {}
