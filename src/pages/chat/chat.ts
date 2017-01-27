import { Component, Input, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataService } from '../../app/services/data';
import { Chat } from '../../app/models/chat';
import { Message } from '../../app/models/message';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Platform, ActionSheetController } from 'ionic-angular';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})

export class ChatPage {

    chat: Chat
    currentMessage: String
    connectionStatus: String
    @ViewChild("mainChat") chatWindow; 

    constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService, public loadingCtrl: LoadingController, public alerCtrl: AlertController, public platform: Platform, public actionsheetCtrl: ActionSheetController) {
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


  public chooseOutcome() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Choose an outcome',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: '1st outcome',
          role: 'destructive',
          handler: () => {
            console.log('1st outcome clicked');
          }
        },
        {
          text: '2nd outcome',
          handler: () => {
            console.log('1st outcome clicked');
          }
        },
        {
          text: '3rd outcome',
          handler: () => {
            console.log('3rd outcome clicked');
          }
        },
        {
          text: '4th outcome',
          handler: () => {
            console.log('4th outcome clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
    }


}
