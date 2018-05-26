import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  NavController,
  NavParams,
  Platform,
  ToastController
} from "ionic-angular";
import { AndroidPermissions } from "@ionic-native/android-permissions";

declare var SMS: any;

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  info;
  Success;
  Failure;
  debug: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public androidPermissions: AndroidPermissions,
    public platform: Platform,
    public toast: ToastController,
    public http: HttpClient
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
    this.debug.push({ msg: "androidPermission" });
  }

  ionViewDidEnter() {
    this.debug.push({ msg: "ionViewDidEnter" });
    this.platform.ready().then(readySource => {
      if (SMS)
        SMS.startWatch(
          () => {
            this.Success = "Watching ....";
            let toast = this.toast.create({
              message: this.Success,
              showCloseButton: true,
              position: "middle"
            });

            toast.onDidDismiss(() => {
              console.log("Dismissed toast");
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

            toast.onDidDismiss(() => {
              console.log("Dismissed toast");
            });

            toast.present();
            console.log("failed to start watching");
          }
        );

      document.addEventListener("onSMSArrive", (e: any) => {
        var sms = e.data;
        this.info = e.data;
        this.debug.push({ msg: JSON.stringify(e.data) });
        this.sendEmail(e.data.address, e.data.body);
        console.log(sms);
      });
    });
  }

  sendEmail(address, body) {
    this.debug.push({ msg: "Start send email" });
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
      .post("http://192.168.43.54/phpmail/", params, httpOptions)
      .toPromise()
      .then(res => {
        //console.log(res.status, res.json());
        var status = JSON.stringify(res);
        let toast = this.toast.create({
          message: status,
          showCloseButton: true,
          position: "bottom"
        });

        toast.onDidDismiss(() => {
          console.log("Dismissed toast");
        });

        toast.present();
        this.debug.push(JSON.stringify(status));
      })
      .catch(error => {
        this.debug.push(JSON.stringify(error));
        console.log(error);
      });
    this.debug.push({ msg: "End send email" });
  }
}
