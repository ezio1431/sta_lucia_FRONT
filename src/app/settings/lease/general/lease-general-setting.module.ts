import { NgModule } from '@angular/core';

import { LeaseGeneralSettingRoutingModule } from './lease-general-setting-routing.module';
import { LeaseGeneralSettingComponent } from './lease-general-setting.component';
import { AddUserComponent } from './add/add-user.component';
import { EditUserComponent } from './edit/edit-user.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        LeaseGeneralSettingRoutingModule,
    ],
    declarations: [
        LeaseGeneralSettingComponent,
        AddUserComponent,
        EditUserComponent
    ],
    entryComponents: [
        AddUserComponent,
        EditUserComponent
    ]
})

export class LeaseGeneralSettingModule {}
