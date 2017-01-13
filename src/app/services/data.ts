import { Injectable, Inject } from '@angular/core';
import { Http,Headers,RequestOptions } from "@angular/http";
import { ChannelEvent } from '../../app/models/channelevent';
import { Chat } from '../../app/models/chat';
import { Observable,Subject } from 'rxjs/Rx';

@Injectable()
export class DataService {

    //let state: String = 'NOT_CONNECTED'
    
    public chats: Array<Chat> = new Array<Chat>();
    public chatsSubject: Subject<Array<Chat>> = new Subject<Array<Chat>>();

    constructor(private $http: Http) {

    }

    public login() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let options = new RequestOptions({
            headers: headers,
            withCredentials: true
        });
        return this.$http.post("https://interactify.io/login?stop_success_redirect=1","username=evg&password=test1234",options);
    }

    public findInteraction(interactionId) {
        for (let chat of this.chats) {
            if(chat.channelId == interactionId) return chat;
        }        
        return null;
    }

    public processMessage(evt) {
        let received_msg = evt.data;
        let data = JSON.parse(received_msg);
        let channelEvent: ChannelEvent = new ChannelEvent()
        let chat: Chat = new Chat()
        //alert(received_msg);
        switch(data.message) {
            case "call_event":
                break;
            case "channel_event":
                channelEvent.fromJson(data);
                // when the channel is initialized, add a new interaction
                if ( channelEvent.interactionType == "chat" ) {
                    if ( channelEvent.status == "init" ) {
                        chat.fromChannelEvent(channelEvent);
                        this.chats.push(chat);
                        this.chatsSubject.next(this.chats);
                    } else {
                        let interaction = this.findInteraction(channelEvent.id);
                        interaction.status = channelEvent.status;
                    }
                }
                break;
            case "chat_message":
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
        this.login().subscribe(response => {
            if ("WebSocket" in window)
            {
                var ws = new WebSocket("wss://interactify.io/websocket");
                ws.onopen = function() {
                    alert('Websocket opened');
                    let options = new RequestOptions({
                        withCredentials: true
                    });
                    self.$http.get("https://interactify.io/im/setstatus?status=available&label=", options).subscribe( result => {} );
                };
                ws.onmessage = this.processMessage.bind(self);
                ws.onclose = function() {
                    alert('Websocket was closed.');
                };
            } else {
                alert('Websocket not supported in this browser!');
            }
        }, err => {
            alert(err);
            alert('Login failed!');
        });
    }

    public getInteractions(): String {
        return "";
    }

}
