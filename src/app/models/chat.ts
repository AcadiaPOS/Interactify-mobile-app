import { Input } from '@angular/core';
import { Message } from '../../app/models/message';
import { ChannelEvent } from '../../app/models/channelevent';
import { Observable,Subject } from 'rxjs/Rx';

export class Chat {
    channelId: String = ""
    callId: String = ""
    agentEmail: String = ""
    userId: String = ""
    userFullname: String = ""
    @Input() status: String = ""

    public messages: Subject<Array<Message>>


    constructor() {
    }	

    public fromChannelEvent(channelEvent: ChannelEvent) {
        this.channelId = channelEvent.id;
        this.callId = channelEvent.callId;
        this.agentEmail = channelEvent.agentId;
        this.userId = channelEvent.callerId;
        this.userFullname = channelEvent.callerDescr;
        this.status = channelEvent.status;
    }
    
}