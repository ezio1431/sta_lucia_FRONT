import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrencySettingModel } from '../model/currency-setting.model';
import { Store } from '@ngrx/store';
import {Observable} from 'rxjs';
import { AppState } from '../../../../reducers';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class CurrencySettingService extends BaseService<CurrencySettingModel> {
    private  localHttpClient: HttpClient;
    constructor(httpClient: HttpClient, private store: Store<AppState>) {
        super( httpClient, 'currencies');
        this.localHttpClient = httpClient;
    }

  /**
   *
   * @ param item
   */
  search(item: any): Observable<any> {
    const extensionUrl = 'search';
    const url =  `${super.getResourceUrl()}/${extensionUrl}`;
    return this.localHttpClient.post<any>(url, {filter: item});
  }

  latest(item: string): Observable<any> {
    const extensionUrl = 'latest';
    const url =  `${super.getResourceUrl()}/${extensionUrl}`;
    return this.localHttpClient.post<any>(url, {base: item});
  }
}
