import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  NavController,
  NavParams,
  Platform,
  ToastController
} from "ionic-angular";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { Storage } from "@ionic/storage";
import { shareComponent } from "../shared/share.component";

declare var SMS: any;

/*  These are the following methods you can use for SMS plugin.

    sendSMS(address(s), text, successCallback, failureCallback);

    listSMS(filter, successCallback, failureCallback);

    deleteSMS(filter, successCallback, failureCallback);

    startWatch(successCallback, failureCallback);

    stopWatch(successCallback, failureCallback);

    enableIntercept(on_off, successCallback, failureCallback);

    restoreSMS(msg_or_msgs, successCallback, failureCallback);

    setOptions(options, successCallback, failureCallback);
*/

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  info;
  Success;
  Failure;
  debug: any = [];
  url = new shareComponent();
  obj = {
    address: "9573879057",
    body: "HI, Button",
    date_sent: "1527404584000",
    date: "1527404584577",
    read: 0,
    seen: 0,
    status: 0,
    type: 1,
    service_center: "+91984908700",
    msg: "Email saved successfully"
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public androidPermissions: AndroidPermissions,
    public platform: Platform,
    public toast: ToastController,
    public http: HttpClient,
    public storage: Storage
  ) {}

  ionViewWillEnter() {
    this.androidPermissions
      .checkPermission(this.androidPermissions.PERMISSION.READ_SMS)
      .then(
        success => console.log("Permission granted"),
        err =>
          this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.READ_SMS
          )
      );

    this.androidPermissions.requestPermissions([
      this.androidPermissions.PERMISSION.READ_SMS
    ]);
  }

  ionViewDidEnter() {
    this.platform
      .ready()
      .then(readySource => {
        this.storage.get("watchSMSTrue").then(val => {
          if (val === true) {
            if (SMS)
              SMS.startWatch(
                () => {
                  this.Success = "Watching ....";
                  let toast = this.toast.create({
                    message: this.Success,
                    showCloseButton: true,
                    position: "middle"
                  });

                  toast.present();
                  console.log("watching started");
                },
                Error => {
                  this.Failure = "Failed";
                  let toast = this.toast.create({
                    message: this.Failure,
                    showCloseButton: true,
                    position: "middle"
                  });

                  toast.present();
                  console.log("failed to start watching");
                }
              );

            document.addEventListener("onSMSArrive", (e: any) => {
              var sms = e.data;
              this.info = e.data;
              this.sendEmail(e.data.address, e.data.body, e.data);
              console.log(sms);
            });
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  sendEmail(address, body, edata) {
    let params = {
      contact: address,
      msg_body: body,
      email: "boppanasandeep57@gmail.com"
    };
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*"
      })
    };
    this.http
      .post(this.url.email_url, params, httpOptions)
      .toPromise()
      .then(res => {
        console.log(res);
        if (res["status"] == 200) {
          let toast = this.toast.create({
            message: res["msg"],
            showCloseButton: false,
            duration: 1000,
            position: "bottom"
          });
          toast.present();
          edata["msg"] = res["msg"];
          this.saveEmailedData(edata);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  saveEmailedData(data) {
    //this.storage.clear();
    this.storage.get("savedEmailedData").then(val => {
      console.log(val);
      if (val === null) {
        this.storage.set("savedEmailedData", JSON.stringify(data));
      } else {
        this.storage.set("savedEmailedData", val + "," + JSON.stringify(data));
      }
      console.log(JSON.parse("[" + val + "]"));
    });
  }
}
