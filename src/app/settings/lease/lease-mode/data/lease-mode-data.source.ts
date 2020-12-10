import { LeaseModeService } from './lease-mode.service';
import { BaseDataSource } from '../../../../shared/base-data-source';

export class LeaseModeDataSource extends BaseDataSource {
    constructor(service: LeaseModeService) {
        super(service);
    }
}
