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
       /* resolve: {
            landlords: PropertyResolverService
        }*/
    },
    { path: 'create', component: AddTenantComponent },
    {
        path: ':id',
        component: ViewTenantComponent,
        /*resolve : { member: LandlordResolverService},*/
        children: [
            { path: '', component: ViewTenantGeneralComponent }
        ]
    },
];


export const TenantRoutingModule = RouterModule.forChild(ROUTES);
