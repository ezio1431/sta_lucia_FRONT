import { NgModule } from '@angular/core';

import { LeaseAgreementSettingRoutingModule } from './lease-agreement-setting-routing.module';
import { LeaseAgreementSettingComponent } from './lease-agreement-setting.component';
import { SharedModule } from '../../../shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
    imports: [
        SharedModule,
        LeaseAgreementSettingRoutingModule,
        AngularEditorModule,
        NgxMatSelectSearchModule
    ],
    declarations: [
        LeaseAgreementSettingComponent
    ],
    entryComponents: [
    ]
})

export class LeaseAgreementSettingModule {}
