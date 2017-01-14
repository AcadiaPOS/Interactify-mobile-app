import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataService } from '../../app/services/data';
import { Chat } from '../../app/models/chat';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {

    chat: Chat

    constructor(public navCtrl: NavController, public navParams: NavParams) {
      let self = this;
      self.chat = navParams.get('chat');
    }

}
