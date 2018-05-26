import { Component } from "@angular/core";
import { NavController, NavParams, Platform } from "ionic-angular";
import { AndroidPermissions } from "@ionic-native/android-permissions";
declare var SMS: any;
@Component({
  selector: "page-list",
  templateUrl: "list.html"
})

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
export class ListPage {
  messages: any = [];
  readListSMS: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public androidPermissions: AndroidPermissions,
    public platform: Platform
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
    this.ReadListSMS();
  }

  ReadListSMS() {
    this.readListSMS = "came to ReadListSMS";
    this.platform.ready().then(readySource => {
      let filter = {
        box: "inbox", // 'inbox' (default), 'sent', 'draft'
        indexFrom: 0, // start from index 0
        maxCount: 100 // count of SMS to return each time
      };

      if (SMS)
        SMS.listSMS(
          filter,
          ListSms => {
            for (let i = 0; i < ListSms.length; i++) {
              let data = { address: ListSms[i].address, body: ListSms[i].body };
              this.messages.push(data);
            }
            console.log("Sms", ListSms);
          },

          Error => {
            this.readListSMS = Error;
            console.log("error list sms: " + Error);
          }
        );
    });
  }
}
