import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HistoryPage } from '../pages/history/history';
import { ActivePage } from '../pages/active/active';
import { TabsPage } from '../pages/tabs/tabs';
import { DataService } from '../app/services/data';

@NgModule({
  declarations: [
    MyApp,
    HistoryPage,
    ActivePage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HistoryPage,
    ActivePage,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, DataService]
})
export class AppModule {}
