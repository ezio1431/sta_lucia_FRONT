import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { EmailTemplateSettingRoutingModule } from './email-template-setting-routing.module';
import { EmailTemplateSettingComponent } from './email-template-setting.component';


@NgModule({
    imports: [
        SharedModule,
        EmailTemplateSettingRoutingModule,
    ],
    declarations: [
        EmailTemplateSettingComponent
    ],
    entryComponents: [
    ]
})

export class EmailTemplateSettingModule {

}
