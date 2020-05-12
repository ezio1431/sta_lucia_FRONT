import { NgModule } from '@angular/core';

import { UserPermissionsSettingRoutingModule } from './user-permissions-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { UserPermissionsSettingComponent } from './user-permissions-setting.component';
import { EditPermissionComponent } from './edit/edit-permission.component';

@NgModule({
    imports: [
        MaterialModule,
        UserPermissionsSettingRoutingModule,
    ],
    declarations: [
        UserPermissionsSettingComponent,
        EditPermissionComponent
    ],
    entryComponents: [
        EditPermissionComponent
    ]
})

export class UserPermissionsSettingModule {}
