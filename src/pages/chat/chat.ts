import { Component, Input, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataService } from '../../app/services/data';
import { Chat } from '../../app/models/chat';
import { Message } from '../../app/models/message';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})

export class ChatPage {

    chat: Chat
    currentMessage: String
    connectionStatus: String
    @ViewChild("mainChat") chatWindow; 

    constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService, public loadingCtrl: LoadingController, public alerCtrl: AlertController) {
      let self = this;
      self.chat = navParams.get('chat');
      let socket = dataService.reconnectingWebSocket;
      self.connectionStatus = socket.statusFormatted(socket.readyState);
      socket.readyStateSubject.subscribe( value => {
        self.connectionStatus = socket.statusFormatted(value);
      });      
      dataService.scrollUpdateSubject.subscribe( () => {
          self.chatWindow.scrollTo(0, 99999, 700);
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
          this.currentMessage = "";
    	    chat.messages.push(message);
    	    chat.messagesSubj.next(chat.messages);
          this.dataService.scrollUpdateSubject.next(null);
        });
    }

    public doConfirmEndChat() {
    let confirm = this.alerCtrl.create({
      title: 'End Chat',
      message: 'Are you sure you wanna end this chat?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked');
          }
        }
      ]
    });
    confirm.present()
  }


}
