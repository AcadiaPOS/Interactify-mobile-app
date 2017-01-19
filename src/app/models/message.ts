export class Message {

    ts: String
    sender_id: String
    sender: String
    sender_email_hash: String
    interaction_id: String
    text: String

    constructor() {
    }	

    public fromJson(data) {
    	this.ts = data["ts"]
    	this.sender_id = data["sender_id"]
    	this.sender = data["sender"]
    	this.sender_email_hash = data["sender_email_hash"]
    	this.interaction_id = data["interaction_id"]
    	this.text = data["text"]
    }
    
}