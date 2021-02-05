import { NgModule } from '@angular/core';

import { AccountingRoutingModule } from './accounting-routing.module';
import { AccountingComponent } from './accounting.component';
import { MaterialModule } from '../shared/material.module';
// import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { StatementComponent } from './statement/statement.component';
import { LedgerComponent } from './ledger/ledger.component';
import { JournalComponent } from './journal/journal.component';
import { FinanceComponent } from './finance/finance.component';
import { OtherReportsComponent } from './other-reports/other-reports.component';

@NgModule({
    imports: [
        MaterialModule,
        AccountingRoutingModule,
        // MatMomentDateModule
    ],
    declarations: [
        AccountingComponent,
        LedgerComponent,
        JournalComponent,
        FinanceComponent,
        OtherReportsComponent
    ],
    entryComponents: [
        StatementComponent
    ]
})

export class AccountingModule {}
