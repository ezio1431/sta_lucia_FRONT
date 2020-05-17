import { BaseModel } from '../../../../shared/models/base-model';

export class TypeModel extends BaseModel {
    utility_name: string;
    utility_display_name: string;
    utility_description: string;

    created_by: string;
    updated_by: string;
}
