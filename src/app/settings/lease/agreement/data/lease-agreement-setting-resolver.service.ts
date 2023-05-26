import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LeaseAgreementSettingModel } from '../model/lease-agreement-setting.model';
import { LeaseAgreementService } from './lease-agreement.service';

@Injectable({ providedIn: 'root' })
export class LeaseAgreementSettingResolverService implements Resolve<LeaseAgreementSettingModel> {

    constructor(private service: LeaseAgreementService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | LeaseAgreementSettingModel {

        return this.service.getAll('', 1, 1);
    }
}
