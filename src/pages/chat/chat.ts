import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataService } from '../../app/services/data';
import { Chat } from '../../app/models/chat';
import { Message } from '../../app/models/message';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})

export class ChatPage {

    chat: Chat
    currentMessage: String
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

    public sendingPopup() {
      let loader = this.loadingCtrl.create({
        content: "Sending...",
        duration: 500
      });
      loader.present();
    }
    public sendMessage() {
        let message = new Message();
        let chat = this.chat;
        this.sendingPopup();
        message.interaction_id = this.chat.callId;
        message.sender = this.chat.agentEmail;
        message.sender_id = this.chat.agentEmail;
        message.text = this.currentMessage;
        message.ts = (new Date()).getUTCSeconds().toString();
        this.dataService.sendChatMessage(message).subscribe( result => {
    	    chat.messages.push(message);
    	    chat.messagesSubj.next(chat.messages);
        });
    }

}
