

export class ChannelEvent {
    status: String
    callId: String
    id: String
    callerId: String
    callerDescr: String
    agentId: String
    interactionType: String

    public fromJson(json) {
    	this.status = json['status'];
    	this.callId = json['callId'];
    	this.id = json['id'];
    	this.callerId = json['callerId'];
    	this.callerDescr = json['callerDescr'];
    	this.agentId = json['agentId'];
    	this.interactionType = json['interactionType'];
    }
}