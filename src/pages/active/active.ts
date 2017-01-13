import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataService } from '../../app/services/data';
import { Chat } from '../../app/models/chat';
import { ChatPage } from '../../pages/chat/chat';

@Component({
  selector: 'page-active',
  templateUrl: 'active.html',
  providers: [ DataService ]
})
export class ActivePage {

    @Input() chats: Array<Chat> = new Array<Chat>();

    constructor(public navCtrl: NavController, public dataService: DataService) {
      var self = this;
      dataService.chatsSubject.subscribe( data => { 
      	alert(data[0].status);
        self.chats = data;
      });
      dataService.initWebsocket();
    }

    public openChat(chat: Chat) {
    	let chatPage = new ChatPage(this.navCtrl, chat);
        this.navCtrl.push(chatPage);
    }

}
