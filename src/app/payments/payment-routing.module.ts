import { Routes, RouterModule } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { AddPaymentComponent } from './add/add-payment.component';
import { PaymentResolverService } from './data/payment-resolver.service';
import { ViewPaymentComponent } from './view/view-payment.component';
import { ViewPaymentGeneralComponent } from './view/general/view-payment-general.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: PaymentComponent,
       /* resolve: {
            landlords: PropertyResolverService
        }*/
    },
    { path: 'create', component: AddPaymentComponent },
    {
        path: ':id',
        component: ViewPaymentComponent,
        /*resolve : { member: LandlordResolverService},*/
        children: [
            { path: '', component: ViewPaymentGeneralComponent }
        ]
    },
];


export const PaymentRoutingModule = RouterModule.forChild(ROUTES);
