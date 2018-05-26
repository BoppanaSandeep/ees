import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  Platform,
  ToastController
} from "ionic-angular";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { EmailComposer } from "@ionic-native/email-composer";

declare var SMS: any;

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  info;
  Success;
  Failure;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public androidPermissions: AndroidPermissions,
    public platform: Platform,
    public toast: ToastController,
    public emailComposer: EmailComposer
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
        this.sendEmail();
        console.log(sms);
      });
    });
  }

  sendEmail() {
    this.emailComposer.isAvailable().then((available: boolean) => {
      if (available) {
        //Now we know we can send
        let toast = this.toast.create({
          message: "Now we know we can send email",
          duration: 5000,
          position: "bottom"
        });

        toast.onDidDismiss(() => {
          console.log("Dismissed toast");
        });

        toast.present();
      }
    });

    let email = {
      to: "boppanasandeep57@gmail.com",
      cc: "",
      bcc: [],
      attachments: [],
      subject: "You have recevied a message.",
      body: `
      <div>
        <h6>Hi,</h6>
        <p>You have recevied a message when you are not their at your phone.</p>
        <div>
          Contact: 9573879057
        </div>
        <div>
          Message: Sandeep
        </div>
      </div>`,
      isHtml: true
    };

    // Send a text message using default options
    this.emailComposer.open(email);
  }
}
