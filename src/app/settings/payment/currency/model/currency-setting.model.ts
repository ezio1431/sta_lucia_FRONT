import { BaseModel } from '../../../../shared/models/base-model';

export class CurrencySettingModel extends BaseModel {
  country: string;
  name: string;
  code: string;
  symbol: string;
  thousand_separator: string;
  decimal_separator: string;
  date: string;
  rate: string;
  for_buying: {
    'status': boolean,
    'class': string,
    'icon': string
  };
  for_selling: {
    'status': boolean,
    'class': string,
    'icon': string
  };
}
