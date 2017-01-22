import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataService } from '../../app/services/data';
import { Chat } from '../../app/models/chat';
import { Message } from '../../app/models/message';
import { LoadingController } from 'ionic-angular';
import { HistoryEntry } from '../../app/models/historyentry';

@Component({
  selector: 'page-historyinfo',
  templateUrl: 'historyinfo.html'
})

export class HistoryinfoPage {

    chat: HistoryEntry
    connectionStatus: String

    constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService, public loadingCtrl: LoadingController) {
      let self = this;
      self.chat = navParams.get('chat');
      let socket = dataService.reconnectingWebSocket;
      self.connectionStatus = socket.statusFormatted(socket.readyState);
      socket.readyStateSubject.subscribe( value => {
        self.connectionStatus = socket.statusFormatted(value);
      });      
    }
}
