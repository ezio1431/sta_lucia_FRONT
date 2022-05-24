import { ExtraChargeService } from './extra-charge.service';
import { BaseDataSource } from '../../../../shared/base-data-source';

export class ExtraChargeDataSource extends BaseDataSource {
    constructor(service: ExtraChargeService) {
        super(service);
    }
}
