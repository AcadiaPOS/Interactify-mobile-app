import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HistoryPage } from '../pages/history/history';
import { ActivePage } from '../pages/active/active';
import { TabsPage } from '../pages/tabs/tabs';
import { ChatPage } from '../pages/chat/chat';
import { LoginPage } from '../pages/login/login';
import { DataService } from '../app/services/data';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';


const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'interactify',
  },
  'push': {
    'sender_id': '498756908110',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};

@NgModule({
  declarations: [
    MyApp,
    HistoryPage,
    ActivePage,
    TabsPage,
    ChatPage,
    LoginPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HistoryPage,
    ActivePage,
    TabsPage,
    ChatPage,
    LoginPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, DataService]
})
export class AppModule {}
