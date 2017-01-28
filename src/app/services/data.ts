import { Injectable, Inject } from '@angular/core';
import { Http,Headers,RequestOptions } from "@angular/http";
import { ChannelEvent } from '../../app/models/channelevent';
import { CallEvent } from '../../app/models/callevent';
import { Chat } from '../../app/models/chat';
import { Message } from '../../app/models/message';
import { HistoryEntry } from '../../app/models/historyentry';
import { Platform } from 'ionic-angular';
import { Observable,Subject } from 'rxjs/Rx';
import { ReconnectingWebSocket } from '../../app/services/ReconnectingWebSocket';
import {
  Push,
  PushToken
} from '@ionic/cloud-angular';

@Injectable()
export class DataService {
    
    public chats: Array<Chat> = new Array<Chat>();
    public chatsSubject: Subject<Array<Chat>> = new Subject<Array<Chat>>();
    public historySubject: Subject<Array<HistoryEntry>> = new Subject<Array<HistoryEntry>>();
    public scrollUpdateSubject: Subject<any> = new Subject();
    public hostname = "manage.interactify.io";
    public baseUri = "https://" + this.hostname;


    constructor(private $http: Http, public push: Push, public platform: Platform, public reconnectingWebSocket: ReconnectingWebSocket) {

    }

    public findChatByChannelId(channelId) {
        for (let chat of this.chats) {
            if(chat.channelId == channelId) return chat;
        }        
        return null;
    }

    public findChatByInteractionId(interactionId) {
        for (let chat of this.chats) {
            if(chat.callId == interactionId) return chat;
        }        
        return null;
    }

    public endInteraction(callId: String) {
        let options = new RequestOptions({
            withCredentials: true
        });
        return this.$http.get(this.baseUri+"/im/chat/end?interactionId=" + callId,options);            
    }

    public getOutcomes() {
        let options = new RequestOptions({
            withCredentials: true
        });
        return this.$http.get(this.baseUri+"/im/outcomes",options);                    
    }

    public submitOutcome(callId: String, outcomeId: String) {
        let options = new RequestOptions({
            withCredentials: true
        });
        return this.$http.get(this.baseUri+"/im/outcome?outcomeId="+outcomeId+"&callId="+callId+"&notes=",options);    
    }

    public acceptPersistentInteraction(callId: String, type: String) {
        let options = new RequestOptions({
            withCredentials: true
        });
        return this.$http.get(this.baseUri+"/im/calls/persistentaccept?callid=" + callId + "&type=" + type,options);       
    }

    public handleCallEvent(callEvent: CallEvent) {
        switch ( callEvent.event ) {
            case 'persistent_prering':
                    // prering event can either be on voice or on a non-voice interaction
                    this.acceptPersistentInteraction(callEvent.callId, callEvent.interactionType).subscribe( result => {} );
                break;
       }       
    }

   public handleChannelEvent(channelEvent: ChannelEvent) {
        let chat: Chat = new Chat();
        // when the channel is initialized, add a new interaction
        switch(channelEvent.status) {
            case "init":
                    chat.fromChannelEvent(channelEvent);
                    this.chats.push(chat);
                    this.chatsSubject.next(this.chats);                
                break;
            case "channel_died":
                    chat.fromChannelEvent(channelEvent);
                    this.chats = this.chats.filter(value => {
                        return value.channelId != chat.channelId;
                    });
                    this.chatsSubject.next(this.chats);
                break;
            default:
                let interaction = this.findChatByChannelId(channelEvent.id);
                interaction.status = channelEvent.status;  
        }
    }

    public playSound(sound: String) {
        let audio = new Audio();
        audio.src = "assets/audio/"+sound+".wav";
        audio.load();
        audio.play();        
    }

    public handleChatMessage(chatMessage: Message) {
        let chat: Chat = this.findChatByInteractionId(chatMessage.interaction_id);
        chat.messages.push(chatMessage);
        chat.messagesSubj.next(chat.messages);
        this.playSound('message');

    }

    public sendChatMessage(chatMessage: Message) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let options = new RequestOptions({
            headers: headers,
            withCredentials: true
        });
        return this.$http.post(this.baseUri+"/im/chat/post","interaction_id="+chatMessage.interaction_id+"&message="+chatMessage.text,options);
    }

    public refreshInteractions() {
        let options = new RequestOptions({
            withCredentials: true
        });
        this.chats = new Array<Chat>();
        this.$http.get(this.baseUri+"/im/json/channels", options).subscribe(result => {
            let channels = result.json();
            for(let jsonChat of channels as Array<any>) {
                let chat = new Chat();
                if (jsonChat.interactionType == "chat") {
                    chat.fromChannelEvent(jsonChat);
                    this.chats.push(chat);
                }
            }
            this.chatsSubject.next(this.chats);
        });
    }

    public processMessage(evt) {
        let received_msg = evt.data;
        let data = JSON.parse(received_msg);
        //alert(received_msg);
        switch(data.message) {
            case "call_event":
                    let callEvent: CallEvent = new CallEvent();
                    callEvent.fromJson(data);    
                    this.handleCallEvent(callEvent);        
                break;
            case "channel_event":
                    let channelEvent: ChannelEvent = new ChannelEvent();
                    channelEvent.fromJson(data);
                    this.handleChannelEvent(channelEvent);
                break;
            case "chat_message":
                    let chatMessage: Message = new Message();
                    chatMessage.fromJson(data);
                    this.handleChatMessage(chatMessage);
                    this.scrollUpdateSubject.next(null);
                break;
            case "queue_event":
                break;
            case "agent_status":
                //alert('agent status message is received');
                break;
        }
    }

    public initWebsocket() {
        var self = this;
        
        if ("WebSocket" in window)
        {
            self.reconnectingWebSocket.close();
            self.reconnectingWebSocket.connect("wss://"+self.hostname+"/websocket",true);
            self.reconnectingWebSocket.onopen = function() {
                let options = new RequestOptions({
                    withCredentials: true
                });
                self.$http.get(self.baseUri+"/im/setstatus?status=available&label=", options).subscribe( result => {
                    self.push.register().then((t: PushToken) => {
                        var platforms = self.platform.platforms().join(',');
                        return self.$http.get(self.baseUri+"/agent/savetoken?token="+t.token+"&device_type="+platforms).map( result => {
                                return t
                            }
                        ).toPromise();
                    }).then((t: PushToken) => {
                        self.refreshInteractions();
                        //console.log('Token saved:', t.token);
                    }, reason => {
                        self.refreshInteractions();
                        alert('Failed to save the token, reason: '+reason);
                    });
                });
            };
            self.reconnectingWebSocket.onmessage = this.processMessage.bind(self);
            self.reconnectingWebSocket.onclose = function() {
            };
        } else {
            alert('Websocket not supported in this browser!');
        }

    }

    public fetchHistory() {
        let options = new RequestOptions({
            withCredentials: true
        });        
        let history = new Array<HistoryEntry>();
        this.$http.get(this.baseUri+"/im/json/history", options).subscribe(result => {
            let channels = result.json();
            for(let jsonChat of channels as Array<any>) {
                let entry = new HistoryEntry();
                if (jsonChat.interactionType == "chat") {
                    entry.fromJson(jsonChat);
                    history.push(entry);
                }
            }
            if (history.length>0) {
              this.historySubject.next(history);              
            } 
        });
    }

}
