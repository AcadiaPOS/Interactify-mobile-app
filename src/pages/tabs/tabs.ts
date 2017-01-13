import { Component } from '@angular/core';

import { ActivePage } from '../active/active';
import { HistoryPage } from '../history/history';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = ActivePage;
  tab2Root: any = HistoryPage;

  constructor() {

  }
}
