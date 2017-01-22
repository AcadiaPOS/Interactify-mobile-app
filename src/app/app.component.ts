import { Component, Inject } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { DataService } from '../app/services/data';
import { ReconnectingWebSocket } from '../app/services/ReconnectingWebSocket';

import { TabsPage } from '../pages/tabs/tabs';
import {
  Push,
  PushToken
} from '@ionic/cloud-angular';

@Component({
  templateUrl: 'app.html',
  providers: [ DataService, ReconnectingWebSocket ]
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform, public push: Push, public dataService: DataService) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      push.rx.notification().subscribe((msg) => {
        //alert('Notification:'+msg.title);
      });

      document.addEventListener("pause", () => {
          dataService.reconnectingWebSocket.close();
      });

      document.addEventListener("resume", () => {
          dataService.initWebsocket();
      });


    });
  }
}
