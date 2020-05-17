import { Routes, RouterModule } from '@angular/router';
import { TypeSettingComponent } from './type-setting.component';

export const ROUTES: Routes = [
    { path: '', component: TypeSettingComponent },
];

export const TypeSettingRoutingModule = RouterModule.forChild(ROUTES);
