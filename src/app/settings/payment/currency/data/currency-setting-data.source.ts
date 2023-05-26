import { CurrencySettingService } from './currency-setting.service';
import { BaseDataSource } from '../../../../shared/base-data-source';

export class CurrencySettingDataSource extends BaseDataSource {
    constructor(service: CurrencySettingService) {
        super(service);
    }
}
