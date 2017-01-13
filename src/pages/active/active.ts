import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataService } from '../../app/services/data';
import { Chat } from '../../app/models/chat';

@Component({
  selector: 'page-active',
  templateUrl: 'active.html',
  providers: [ DataService ]
})
export class ActivePage {

    dataService: DataService;
    @Input() chats: Array<Chat> = new Array<Chat>();

    constructor(public navCtrl: NavController, dataService: DataService) {
      this.dataService = dataService;
      var self = this;
      dataService.chatsSubject.subscribe( data => { 
      	alert(data[0].status);
        self.chats = data;
      });
      dataService.initWebsocket();
    }

}
