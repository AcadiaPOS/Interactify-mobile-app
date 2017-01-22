import { Input } from '@angular/core';
import { Message } from '../../app/models/message';
import { Observable,Subject } from 'rxjs/Rx';

export class HistoryEntry {
    interactionType: String = ""
    callId: String = ""
    callerId: String = ""
    ts: String = ""

    messages: Array<Message> = new Array<Message>()

    constructor() {
    }	

    public fromJson(json) {
        this.interactionType = json['type'];
        this.callId = json['callId'];
        this.callerId = json['callerId'];
        this.ts = json['ts'];

        let history = json['history'];
        for(let jsonMessage of history as Array<any>) {
        	let message = new Message();
        	message.fromJson(jsonMessage);
        	this.messages.push(message);
        }
    }
    
}