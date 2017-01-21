import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataService } from '../../app/services/data';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  username: string
  password: string
  loginError: string

  constructor(public navCtrl: NavController, public dataService: DataService) {

  }

  public login() {
  	var self = this;
    window.localStorage.setItem("username", this.username);
    window.localStorage.setItem("password", this.password);
    self.dataService.reconnectingWebSocket.login().subscribe( result => {
      self.dataService.initWebsocket();
      self.navCtrl.pop();
    }, err => {
    	self.loginError = "Login failed";
    });  
  }
}