import { Injectable } from '@angular/core';
import { TaskModel } from '../models/task-model';
import { HttpClient } from '@angular/common/http';
import { AppHttpUrlGenerator } from '../../core/app-http-url-generator';
import { BaseDataService } from '../../shared/services/base-data.service';

@Injectable({ providedIn: 'root' })
export class TaskDataService extends BaseDataService<TaskModel> {

    constructor(http: HttpClient, httpUrlGenerator?: AppHttpUrlGenerator) {
         super('Landlord', 'landlords', http, httpUrlGenerator);
    }
}
