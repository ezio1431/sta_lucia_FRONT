import { Component} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { selectorLanguage } from './authentication/authentication.selectors';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  loading = true;
  lang = 'en';
  constructor(translate: TranslateService, private router: Router, private store: Store) {

    this.store.pipe(select(selectorLanguage)).subscribe(language => {
      if (typeof language !== 'undefined') {
        this.lang = language;
      }
    });
  //  translate.addLangs(['en', 'klingon']);
   // translate.setDefaultLang('en');
    translate.use(this.lang);

    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.loading = false;
      }
    });
  }

}
