import { BaseModel } from '../../../../shared/models/base-model';

export class PaymentFrequencyModel extends BaseModel {
    payment_frequency_name: string;
    payment_frequency_display_name: string;
    payment_frequency_description: string;

    created_by: string;
    updated_by: string;
}
