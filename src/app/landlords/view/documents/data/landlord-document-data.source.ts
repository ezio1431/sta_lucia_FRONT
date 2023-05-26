import { LandlordDocumentService } from './landlord-document.service';
import { BaseDataSource } from '../../../../shared/base-data-source';

export class LandlordDocumentDataSource extends BaseDataSource {
    constructor(service: LandlordDocumentService) {
        super(service);
    }
}
