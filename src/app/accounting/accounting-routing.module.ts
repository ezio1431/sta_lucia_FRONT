import { Routes, RouterModule } from '@angular/router';
import { AccountingComponent } from './accounting.component';
import { LedgerComponent } from './ledger/ledger.component';
import { JournalComponent } from './journal/journal.component';
import { FinanceComponent } from './finance/finance.component';

export const ROUTES: Routes = [
    {
        path: '', component: AccountingComponent,
        children: [
            { path: '', component: LedgerComponent},
              { path: 'journal', component: JournalComponent },
              { path: 'other_reports', component: FinanceComponent }
        ]
    }
];
export const AccountingRoutingModule = RouterModule.forChild(ROUTES);
