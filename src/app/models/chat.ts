import { Input } from '@angular/core';
import { Message } from '../../app/models/message';
import { ChannelEvent } from '../../app/models/channelevent';
import { HistoryEntry } from '../../app/models/historyentry';
import { Observable,Subject } from 'rxjs/Rx';

export class Chat {
    channelId: String = "";
    callId: String = "";
    agentEmail: String = "";
    userId: String = "";
    userFullname: String = "";
    callerIdHash: String = "";
    outcomeSubmitted: Boolean = false;
    status: String = "";

    public messages: Array<Message> = new Array<Message>()
    public messagesSubj: Subject<Array<Message>> = new Subject<Array<Message>>()


    constructor() {
    }	

    public fromChannelEvent(channelEvent: ChannelEvent) {
        this.channelId = channelEvent.id;
        this.callId = channelEvent.callId;
        this.agentEmail = channelEvent.agentId;
        this.userId = channelEvent.callerId;
        this.userFullname = channelEvent.callerDescr;
        this.status = channelEvent.status;
        this.callerIdHash = channelEvent.callerIdHash;
    }    
}
