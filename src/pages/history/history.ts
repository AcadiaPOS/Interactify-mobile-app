import { Component, Input } from '@angular/core';
import { HistoryEntry } from '../../app/models/historyentry';
import { DataService } from '../../app/services/data';
import { Message } from '../../app/models/message';
import { HistoryinfoPage } from '../../pages/historyinfo/historyinfo';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class HistoryPage {

  @Input() historyChats: Array<HistoryEntry> = new Array<HistoryEntry>();
  connectionStatus: String = ""

  constructor(public navCtrl: NavController, public dataService: DataService) {
    let self = this;
    let socket = dataService.reconnectingWebSocket;
    self.connectionStatus = socket.statusFormatted(socket.readyState);
    socket.readyStateSubject.subscribe( value => {
      self.connectionStatus = socket.statusFormatted(value);
    });
    dataService.historySubject.subscribe( history => {
      self.historyChats = history;
    });
  }

  public openChat(history: HistoryEntry) {
    this.navCtrl.push(HistoryinfoPage, {chat: history});
  }

  public fetchHistory() {
  	this.dataService.fetchHistory();
  }

}
