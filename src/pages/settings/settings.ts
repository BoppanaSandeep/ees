import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Storage } from "@ionic/storage";
import {
  NativePageTransitions,
  NativeTransitionOptions
} from "@ionic-native/native-page-transitions";

@Component({
  selector: "page-settings",
  templateUrl: "settings.html"
})
export class SettingsPage {
  watchSMS: boolean;
  watchCallLog: boolean;
  clearDisableForSMS: boolean;
  clearDisableForSavedEmails: boolean;
  public options: NativeTransitionOptions = {
    direction: "left",
    duration: 300,
    slowdownfactor: 4,
    iosdelay: 50,
    androiddelay: 50,
    fixedPixelsTop: 0,
    fixedPixelsBottom: 0
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    private nativePageTransitions: NativePageTransitions
  ) {}

  ionViewWillEnter() {}

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

    this.storage.get("watchMissedCallsTrue").then(val => {
      if (val === null) {
        this.watchCallLog = true;
        this.storage.set("watchMissedCallsTrue", true);
      } else {
        console.log(val);
        this.watchCallLog = val;
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

  disableWatchCallLog(watchCallLog) {
    console.log(watchCallLog);
    watchCallLog = watchCallLog == false ? true : false;
    this.storage
      .set("watchMissedCallsTrue", watchCallLog)
      .then(val => {
        console.log(val);
      })
      .catch(error => {
        console.log(error);
      });
  }

  clearEmailedSMS() {
    this.storage
      .set("savedEmailedData", null)
      .then(val => {
        this.clearDisableForSMS = true;
      })
      .catch(error => {
        console.log(error);
      });
  }

  clearSavedEmails() {
    this.storage
      .set("saveEmailsWithOptions", null)
      .then(val => {
        this.clearDisableForSavedEmails = true;
      })
      .catch(error => {
        console.log(error);
      });
  }

  ionViewWillLeave() {
    this.nativePageTransitions
      .slide(this.options)
      .then(onSuccess => {
        console.log(JSON.stringify(onSuccess));
      })
      .catch(error => {
        console.log(JSON.stringify(error));
      });
  }
}
