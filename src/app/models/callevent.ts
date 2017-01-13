

export class CallEvent {
    event: String
    callId: String
    callerId: String
    agentId: String
    interactionType: String

    public fromJson(json) {
    	this.event = json['event'];
    	this.callId = json['callId'];
    	this.callerId = json['callerId'];
    	this.agentId = json['agentId'];
    	this.interactionType = json['interactionType'];
    }
}