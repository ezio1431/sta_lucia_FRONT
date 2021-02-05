import { BaseModel } from '../../shared/models/base-model';

export class PaymentModel extends BaseModel {
    agent_id: string;
    property_id: string;
    unit_id: string;

    utility_id: string;

    base_charge: string;
    previous_reading: string;
    current_reading: string;
    reading_date: string;
    rate_per_unit: string;
    units: string;
    total: string;


    invoice_number: string;
    invoice_total: string;
    invoice_discount: string;
    invoice_tax: string;
    invoice_status: string;
    invoice_terms: string;
    invoice_date: string;
    due_date: string;
    note: string;


    created_by: string;
    updated_by: string;
}
