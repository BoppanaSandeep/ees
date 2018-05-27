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
  ) {
    this.storage.get("watchSMSTrue").then(val => {
      if (val === null) {
        this.watchSMS = true;
        this.storage.set("watchSMSTrue", true);
      } else {
        console.log(val);
        this.watchSMS = val;
      }
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SettingsPage");

    this.storage.get("savedEmailedData").then(val => {
      if (val === null) {
        this.clearDisable = true;
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
    this.storage.set("savedEmailedData", null);
  }
}
