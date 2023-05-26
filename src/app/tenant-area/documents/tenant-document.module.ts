import { NgModule } from '@angular/core';
import { TenantDocumentRoutingModule } from './tenant-document-routing.module';
import { TenantDocumentComponent } from './tenant-document.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        TenantDocumentRoutingModule
    ],
    declarations: [
        TenantDocumentComponent
    ]
})

export class TenantDocumentModule {
    constructor () {
    }
}
