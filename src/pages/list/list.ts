import { Component } from "@angular/core";
import { NavController, NavParams, Platform } from "ionic-angular";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { Storage } from "@ionic/storage";
import {
  NativePageTransitions,
  NativeTransitionOptions
} from "@ionic-native/native-page-transitions";

@Component({
  selector: "page-list",
  templateUrl: "list.html"
})
export class ListPage {
  readSMSList: any;
  segment = "Messages";
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
    public androidPermissions: AndroidPermissions,
    public platform: Platform,
    public storage: Storage,
    private nativePageTransitions: NativePageTransitions
  ) {
    this.updateSMSView();
  }

  ionViewWillEnter() {}

  updateView() {
    if (this.segment === "Messages") {
      this.updateSMSView();
    } else {
      this.updateCALLView();
    }
  }

  updateCALLView() {}

  updateSMSView() {
    this.storage.get("savedEmailedData").then(val => {
      console.log(val);
      if (val === null) {
        this.readSMSList = [];
      } else {
        this.readSMSList = JSON.parse("[" + val + "]");
        console.log(this.readSMSList);
      }
      console.log(this.readSMSList);
    });
  }

  removeEmailedSMS(index) {
    console.log(index);
    this.storage.get("savedEmailedData").then(val => {
      if (val === null) {
        this.readSMSList = [];
      } else {
        this.readSMSList = JSON.parse("[" + val + "]");
        console.log(this.readSMSList);
        this.readSMSList.splice(index, 1);
        console.log(this.readSMSList);
        console.log(JSON.stringify(this.readSMSList).slice(1, -1));
        if (this.readSMSList.length > 0) {
          this.storage
            .set(
              "savedEmailedData",
              JSON.stringify(this.readSMSList).slice(1, -1)
            )
            .then(_ => {
              this.updateSMSView();
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          this.storage
            .set("savedEmailedData", null)
            .then(_ => {
              this.updateSMSView();
            })
            .catch(error => {
              console.log(error);
            });
        }
      }
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
