import { NgModule } from '@angular/core';

import { CurrencySettingRoutingModule } from './currency-setting-routing.module';
import { CurrencySettingComponent } from './currency-setting.component';
import { AddCurrencyComponent } from './add/add-currency.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        CurrencySettingRoutingModule
    ],
    declarations: [
        CurrencySettingComponent,
        AddCurrencyComponent
    ]
})

export class CurrencySettingModule {}
