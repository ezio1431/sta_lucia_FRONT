import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { selectorCompanyName } from '../../authentication/authentication.selectors';
import { GeneralSettingService } from '../../settings/general/data/general-setting.service';

@Component({
  selector: 'robi-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentDate: Date = new Date();

  companyName: string;
  isValid: boolean;

  constructor(private store: Store<AppState>, private generalSettingService: GeneralSettingService,) {
    this.store.pipe(select(selectorCompanyName)).subscribe(name => this.companyName = name);
  }

  ngOnInit() {
   // this.isValid = this.verify();
    this.isValid = true;
  }

  verify(): boolean {
    this.generalSettingService.verify().subscribe(data => {
      return !!data;
    });
    return false;
  }

}
