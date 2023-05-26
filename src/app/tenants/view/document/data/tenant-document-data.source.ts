import { TenantDocumentService } from './tenant-document.service';
import { BaseDataSource } from '../../../../shared/base-data-source';

export class TenantDocumentDataSource extends BaseDataSource {
    constructor(service: TenantDocumentService) {
        super(service);
    }
}
