import { PaymentFrequencyService } from './payment-frequency.service';
import { BaseDataSource } from '../../../../shared/base-data-source';

export class PaymentFrequencyDataSource extends BaseDataSource {
    constructor(service: PaymentFrequencyService) {
        super(service);
    }
}
