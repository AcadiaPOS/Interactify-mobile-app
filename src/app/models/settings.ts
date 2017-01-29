export class Settings {
    auto_accept: String = "";
    allow_wrapup: String = "";
    wrapup_time: String = "";

    constructor() {
    }	

    public fromJson(json) {
        this.auto_accept = json['auto_accept'];
        this.allow_wrapup = json['allow_wrapup'];
        this.wrapup_time = json['wrapup_time'];
    }    
}
