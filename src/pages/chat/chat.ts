import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataService } from '../../app/services/data';
import { Chat } from '../../app/models/chat';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  providers: [ DataService ]
})
export class ChatPage {

    constructor(public navCtrl: NavController, public chat: Chat) {
      var self = this;
    }

}
