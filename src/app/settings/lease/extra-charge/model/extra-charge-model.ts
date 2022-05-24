import { BaseModel } from '../../../../shared/models/base-model';

export class ExtraChargeModel extends BaseModel {
    extra_charge_name: string;
    extra_charge_display_name: string;
    extra_charge_description: string;
}
