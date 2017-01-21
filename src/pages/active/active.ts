import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataService } from '../../app/services/data';
import { Chat } from '../../app/models/chat';
import { ChatPage } from '../../pages/chat/chat';
import { LoginPage } from '../../pages/login/login';

@Component({
  selector: 'page-active',
  templateUrl: 'active.html'
})
export class ActivePage {

    @Input() chats: Array<Chat> = new Array<Chat>();
    connectionStatus: String

    constructor(public navCtrl: NavController, public dataService: DataService) {
      var self = this;
      dataService.chatsSubject.subscribe( data => { 
        self.chats = data;
      });
      let socket = dataService.reconnectingWebSocket;
      socket.readyStateSubject.subscribe( value => {
        self.connectionStatus = socket.statusFormatted(value);
      });       
      dataService.reconnectingWebSocket.login().subscribe( result => {
        dataService.initWebsocket();
      }, err => {
        self.navCtrl.push(LoginPage);
      });    
    }

    public openChat(chat: Chat) {
      this.navCtrl.push(ChatPage, {chat: chat});
      chat.messagesSubj.next(chat.messages);
    }

}
