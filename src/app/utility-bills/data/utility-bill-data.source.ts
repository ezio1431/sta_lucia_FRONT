import { UtilityBillService } from './utility-bill.service';
import { BaseDataSource } from '../../shared/base-data-source';

export class UtilityBillDataSource extends BaseDataSource {
    constructor(service: UtilityBillService) {
        super(service);
    }
}
