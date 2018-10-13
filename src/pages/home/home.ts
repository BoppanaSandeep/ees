import { shareComponent } from "./../shared/share.component";
import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  NavController,
  NavParams,
  Platform,
  ToastController
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { Storage } from "@ionic/storage";
import { CallLog } from "@ionic-native/call-log";
import { Observable } from "rxjs/Rx";
import {
  NativePageTransitions,
  NativeTransitionOptions
} from "@ionic-native/native-page-transitions";

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
  WatchingSMS: boolean;
  debug: any = [];
  shareComponent = new shareComponent();
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
  public saveEmailsWithOptions: FormGroup;
  public readSavedEmails;
  public readMissedCalls;
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
    public toast: ToastController,
    public http: HttpClient,
    public storage: Storage,
    public formBuilder: FormBuilder,
    public callLog: CallLog,
    private nativePageTransitions: NativePageTransitions
  ) {
    this.saveEmailsWithOptions = this.formBuilder.group({
      emailId: ["", [Validators.required, Validators.email]],
      enableEmailOrnot: [false, [Validators.required]]
    });
    this.readEmailsFromStorage();
  }

  ionViewWillEnter() {
    // READ_SMS Android permission.
    this.androidPermissions
      .checkPermission(this.androidPermissions.PERMISSION.READ_SMS)
      .then(success => console.log("Permission granted" + success))
      .catch(error => {
        this.androidPermissions
          .requestPermission(this.androidPermissions.PERMISSION.READ_SMS)
          .catch(error => {
            console.log(JSON.stringify(error));
          });
        console.log(JSON.stringify(error));
      });

    this.androidPermissions
      .requestPermissions([this.androidPermissions.PERMISSION.READ_SMS])
      .catch(error => {
        console.log(JSON.stringify(error));
      });

    // READ_CALL_LOG Android permission.
    this.callLog.hasReadPermission().then(value => {
      if (value === false) {
        this.callLog
          .requestReadPermission()
          .then(() => {
            console.log("Permission granted");
          })
          .catch(error => {
            console.log(JSON.stringify(error));
          });
      }
    });

    this.platform
      .ready()
      .then(() => {
        // Watch SMS
        this.storage.get("watchSMSTrue").then(val => {
          if (val === true) {
            try {
              if (SMS)
                SMS.startWatch(
                  () => {
                    this.WatchingSMS = true;
                    console.log("watching started");
                  },
                  error => {
                    this.WatchingSMS = false;
                    console.log("failed to start watching" + error);
                  }
                );
            } catch (error) {
              console.log(error);
            }

            document.addEventListener("onSMSArrive", (e: any) => {
              var sms = e.data;
              console.log(sms);
              this.storage
                .get("saveEmailsWithOptions")
                .then(val => {
                  if (val === null) {
                  } else {
                    var readSavedEmails = JSON.parse("[" + val + "]");
                    console.log(readSavedEmails);
                    var appendedEmails = "";
                    readSavedEmails.forEach((emails, index) => {
                      appendedEmails +=
                        index == readSavedEmails.length - 1
                          ? emails.emailId
                          : emails.emailId + ", ";
                    });
                    this.sendEmail(
                      e.data.address,
                      e.data.body,
                      appendedEmails,
                      e.data
                    );
                  }
                })
                .catch(error => {
                  console.log(JSON.stringify(error));
                });
            });
          } else {
            this.WatchingSMS = false;
          }
        });

        // Watch Call log
        this.storage
          .get("watchMissedCallsTrue")
          .then(value => {
            if (value === true) {
              Observable.interval(10000).subscribe(x => {
                this.missedCallLogs();
              });
            } else {
              Observable.interval(0)
                .subscribe(x => {
                  this.missedCallLogs();
                })
                .unsubscribe();
            }
          })
          .catch(error => {
            console.log(JSON.stringify(error));
          });
      })
      .catch(error => {
        console.log(JSON.stringify(error));
      });
  }

  sendEmail(phoneNumber, body, emails, edata) {
    let params = {
      contact: phoneNumber,
      msg_body: body,
      email: emails
    };
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*"
      })
    };
    this.http
      .post(this.shareComponent.email_url, params, httpOptions)
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
        // this.saveEmailedData(edata);
        let toast = this.toast.create({
          message: "Something went wrong!!!",
          showCloseButton: false,
          duration: 2000,
          position: "bottom"
        });
        toast.present();
        console.log(JSON.stringify(error));
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

  ngAddEmails() {}

  addEmails() {
    console.log(this.saveEmailsWithOptions.value);
    this.storage
      .get("saveEmailsWithOptions")
      .then(val => {
        if (val === null) {
          this.storage
            .set(
              "saveEmailsWithOptions",
              JSON.stringify(this.saveEmailsWithOptions.value)
            )
            .then(val => {
              console.log(val);
              this.clearEmailSavingForm();
              this.readEmailsFromStorage();
            })
            .catch(error => {
              console.log(JSON.stringify(error));
            });
        } else {
          this.storage
            .set(
              "saveEmailsWithOptions",
              val + "," + JSON.stringify(this.saveEmailsWithOptions.value)
            )
            .then(val => {
              console.log(val);
              this.clearEmailSavingForm();
              this.readEmailsFromStorage();
            })
            .catch(error => {
              console.log(JSON.stringify(error));
            });
        }
      })
      .catch(error => {
        console.log(JSON.stringify(error));
      });
  }

  clearEmailSavingForm() {
    this.saveEmailsWithOptions = this.formBuilder.group({
      emailId: ["", [Validators.required, Validators.email]],
      enableEmailOrnot: [false, [Validators.required]]
    });
  }

  readEmailsFromStorage() {
    this.storage.get("saveEmailsWithOptions").then(val => {
      console.log(val);
      if (val === null) {
        this.readSavedEmails = [];
        console.log(this.readSavedEmails);
      } else {
        this.readSavedEmails = JSON.parse("[" + val + "]");
        console.log(this.readSavedEmails);
      }
    });
  }

  removeEmailsFromStorage(index) {
    console.log(index);
    this.storage.get("saveEmailsWithOptions").then(val => {
      if (val === null) {
        this.readSavedEmails = [];
      } else {
        this.readSavedEmails = JSON.parse("[" + val + "]");
        console.log(this.readSavedEmails);
        this.readSavedEmails.splice(index, 1);
        console.log(this.readSavedEmails);
        console.log(
          'For identifing whether "[","]" are removed or not at remove emails...',
          JSON.stringify(this.readSavedEmails).slice(1, -1)
        );
        if (this.readSavedEmails.length > 0) {
          this.storage
            .set(
              "saveEmailsWithOptions",
              JSON.stringify(this.readSavedEmails).slice(1, -1)
            )
            .then(_ => {
              console.log("remove the email from storage ... ", _);
              this.readEmailsFromStorage();
            })
            .catch(error => {
              console.log(JSON.stringify(error));
            });
        } else {
          this.storage
            .set("saveEmailsWithOptions", null)
            .then(_ => {
              console.log("remove the email from storage ... ", _);
              this.readEmailsFromStorage();
            })
            .catch(error => {
              console.log(JSON.stringify(error));
            });
        }
      }
    });
  }

  enableOrDisableEmailsFromStorage(index, boolValue) {
    console.log(index);
    this.storage.get("saveEmailsWithOptions").then(val => {
      if (val === null) {
        this.readSavedEmails = [];
      } else {
        this.readSavedEmails = JSON.parse("[" + val + "]");
        console.log(this.readSavedEmails);
        this.readSavedEmails[index].enableEmailOrnot =
          boolValue == true ? false : true;
        console.log(this.readSavedEmails);
        console.log(
          'For identifing whether "[","]" are removed or not at enable disable emails...',
          JSON.stringify(this.readSavedEmails).slice(1, -1)
        );
        this.storage
          .set(
            "saveEmailsWithOptions",
            JSON.stringify(this.readSavedEmails).slice(1, -1)
          )
          .then(_ => {
            console.log("Enable or disable event ... ", _);
            this.readEmailsFromStorage();
          })
          .catch(error => {
            console.log(JSON.stringify(error));
          });
      }
    });
  }

  missedCallLogs() {
    // requestPermission for Call log
    var time = localStorage.getItem("lastFetchedLog")
      ? localStorage.getItem("lastFetchedLog")
      : Date.parse(new Date().toUTCString()) / 1000;
    var filters: any = [
      {
        name: "type",
        value: 3,
        operator: "like"
      },
      {
        name: "date",
        value: time,
        operator: ">="
      }
    ];
    this.callLog
      .getCallLog(filters)
      .then(log => {
        this.readMissedCalls = JSON.stringify(log);
        console.log(JSON.stringify(log));
        localStorage.setItem(
          "lastFetchedLog",
          String(Date.parse(new Date().toUTCString()) / 1000)
        );
        this.storage
          .get("saveEmailsWithOptions")
          .then(val => {
            if (val === null) {
            } else {
              var readSavedEmails = JSON.parse("[" + val + "]");
              console.log(readSavedEmails);
              var appendedEmails = "";
              readSavedEmails.forEach((emails, index) => {
                appendedEmails +=
                  index == readSavedEmails.length - 1
                    ? emails.emailId
                    : emails.emailId + ", ";
              });
              this.sendEmail(log.address, log.body, appendedEmails, log);
            }
          })
          .catch(error => {
            console.log(JSON.stringify(error));
          });
      })
      .catch(error => {
        console.log(JSON.stringify(error));
      });
  }

  toastMsg(message) {
    let toast = this.toast.create({
      message: message,
      showCloseButton: true,
      position: "bottom"
    });
    toast.present();
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
