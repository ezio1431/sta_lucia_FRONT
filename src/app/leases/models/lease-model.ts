import { BaseModel } from '../../shared/models/base-model';

export class LeaseModel extends BaseModel {
    agent_id: string;
    property_id: string;
    unit_id: string;
    lease_type_id: string;
    lease_mode_id: string;
    start_date: string;
    end_date: string;
    due_date: string;
    rent_amount: string;
    payment_frequency_id: string;
    due_on: string;
    agreement_doc: string;

    created_by: string;
    updated_by: string;
}
