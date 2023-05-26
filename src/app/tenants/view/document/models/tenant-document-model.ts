import { BaseModel } from '../../../../shared/models/base-model';

export class TenantDocumentModel extends BaseModel {
    tenant_id: string;
    document: string;
}
