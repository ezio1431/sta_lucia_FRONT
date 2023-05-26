import { BaseModel } from '../../../../shared/models/base-model';

export class LandlordDocumentModel extends BaseModel {
    landlord_id: string;
    document: string;
}
