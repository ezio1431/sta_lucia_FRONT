import { Routes, RouterModule } from '@angular/router';
import { TenantComponent } from './tenant.component';
import { AddTenantComponent } from './add/add-tenant.component';
import { TenantResolverService } from './data/tenant-resolver.service';
import { ViewTenantComponent } from './view/view-tenant.component';
import { ViewTenantGeneralComponent } from './view/general/view-tenant-general.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: TenantComponent,
        resolve: {
            landlords: TenantResolverService
        }
    },
    {
        path: ':id',
        component: ViewTenantComponent,
        /*resolve : { member: LandlordResolverService},*/
        children: [
            { path: '', component: ViewTenantGeneralComponent }
        ]
    },
    { path: 'create', component: AddTenantComponent },
];


export const TenantRoutingModule = RouterModule.forChild(ROUTES);
