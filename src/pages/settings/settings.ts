import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Storage } from "@ionic/storage";

@Component({
  selector: "page-settings",
  templateUrl: "settings.html"
})
export class SettingsPage {
  watchSMS: boolean;
  clearDisableForSMS: boolean;
  clearDisableForSavedEmails: boolean;
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
        this.clearDisableForSMS = true;
        console.log("clearDisableForSMS", true);
      }
    });

    this.storage.get("saveEmailsWithOptions").then(val => {
      if (val === null) {
        this.clearDisableForSavedEmails = true;
        console.log("clearDisableForSavedEmails", true);
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
      this.clearDisableForSMS = true;
    }).catch(error => { console.log(error); });
  }

  clearSavedEmails() {
    this.storage.set("saveEmailsWithOptions", null).then(val => {
      this.clearDisableForSavedEmails = true;
    }).catch(error => { console.log(error); });
  }
}
