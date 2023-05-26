import { BaseModel } from '../../../../shared/models/base-model';

export class PaymentMethodModel extends BaseModel {
    display_name: string;
    type: string;
    details: any;
    charges: any;
    payment_method_description: string;
}
