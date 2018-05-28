import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Storage } from "@ionic/storage";

@Component({
  selector: "page-settings",
  templateUrl: "settings.html"
})
export class SettingsPage {
  watchSMS: boolean;
  clearDisable: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage
  ) { }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SettingsPage");
    this.storage.get("watchSMSTrue").then(val => {
      if (val === null) {
        this.watchSMS = true;
        this.storage.set("watchSMSTrue", true);
      } else {
        console.log(val);
        this.watchSMS = val;
      }
    });
    this.storage.get("savedEmailedData").then(val => {
      if (val === null) {
        this.clearDisable = true;
        console.log("clearDisable", true);
      }
    });
  }

  disableWatchSMS(watchSMS) {
    console.log(watchSMS);
    watchSMS = watchSMS == false ? true : false;
    this.storage
      .set("watchSMSTrue", watchSMS)
      .then(val => {
        console.log(val);
      })
      .catch(error => {
        console.log(error);
      });
  }

  clearEmailedSMS() {
    this.storage.set("savedEmailedData", null).then(val => {
      this.clearDisable = true;
    }).catch(error => { });
  }
}
