import { BaseModel } from '../../../../shared/models/base-model';

export class LeaseModeModel extends BaseModel {
    lease_mode_name: string;
    lease_mode_display_name: string;
    lease_mode_description: string;

    created_by: string;
    updated_by: string;
}
