import { Routes, RouterModule } from '@angular/router';
import { UtilityBillComponent } from './utility-bill.component';
import { AddUtilityBillComponent } from './add/add-utility-bill.component';
import { UtilityBillResolverService } from './data/utility-bill-resolver.service';
import { ViewUtilityBillComponent } from './view/view-utility-bill.component';
import { ViewUtilityBillGeneralComponent } from './view/general/view-utility-bill-general.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: UtilityBillComponent,
       /* resolve: {
            landlords: PropertyResolverService
        }*/
    },
    { path: 'create', component: AddUtilityBillComponent },
    {
        path: ':id',
        component: ViewUtilityBillComponent,
        /*resolve : { member: LandlordResolverService},*/
        children: [
            { path: '', component: ViewUtilityBillGeneralComponent }
        ]
    },
];


export const UtilityBillRoutingModule = RouterModule.forChild(ROUTES);
