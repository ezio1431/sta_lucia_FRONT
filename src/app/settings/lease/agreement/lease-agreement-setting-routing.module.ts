import { Routes, RouterModule } from '@angular/router';
import { LeaseAgreementSettingComponent } from './lease-agreement-setting.component';
import { LeaseAgreementSettingResolverService } from './data/lease-agreement-setting-resolver.service';

export const ROUTES: Routes = [
    {
        path: '', component: LeaseAgreementSettingComponent,
        resolve              : {
            settings: LeaseAgreementSettingResolverService
        }
    }
];

export const LeaseAgreementSettingRoutingModule = RouterModule.forChild(ROUTES);
