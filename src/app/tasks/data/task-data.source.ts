import { TaskService } from './task.service';
import { BaseDataSource } from '../../shared/base-data-source';

export class TaskDataSource extends BaseDataSource {
    constructor(service: TaskService) {
        super(service);
    }
}
