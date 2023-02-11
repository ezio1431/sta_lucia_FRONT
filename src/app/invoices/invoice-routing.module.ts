import { Routes, RouterModule } from '@angular/router';
import { InvoiceComponent } from './invoice.component';
import { AddInvoiceComponent } from './add/add-invoice.component';
import { ViewInvoiceComponent } from './view/view-invoice.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: InvoiceComponent
    },
    { path: 'create', component: AddInvoiceComponent },
    {
        path: ':id',
        component: ViewInvoiceComponent
    },
];


export const InvoiceRoutingModule = RouterModule.forChild(ROUTES);
