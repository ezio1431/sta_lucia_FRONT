import { BaseModel } from '../../shared/models/base-model';

export class TaskModel extends BaseModel {
    title: string;
    date: string;
    lease_id: string;
    property_id: string;
    unit_id: string;
    tenant_id: string;
    task_category: string;
    priority: string;
    status: string;
    description: string;
}
