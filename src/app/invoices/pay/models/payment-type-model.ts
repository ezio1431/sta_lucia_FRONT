import { BaseModel } from '../../../shared/models/base-model';

export class PaymentTypeModel extends BaseModel {
    type: string;
    display_name: string;
    details: any;
    charges: {
        percent_charge: number;
        fixed_charge: number;
    };
    payment_method_description: string;
    created_by: string;
    updated_by: string;
}
