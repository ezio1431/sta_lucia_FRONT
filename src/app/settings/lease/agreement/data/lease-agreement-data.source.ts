import { LeaseAgreementService } from './lease-agreement.service';
import { BaseDataSource } from '../../../../shared/base-data-source';

export class LeaseAgreementDataSource extends BaseDataSource {
    constructor(service: LeaseAgreementService) {
        super(service);
    }
}
