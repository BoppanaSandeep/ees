import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
declare var SMS: any;
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})

export class ListPage {
  
  selectedItem: any;
  icons: string[];
  messages: any = [];
  items: Array<{ title: string, note: string, icon: string }>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public androidPermissions: AndroidPermissions, public platform: Platform) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
      'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    for (let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ListPage, {
      item: item
    });
  }

  checkPermission() {
    this.androidPermissions.checkPermission
      (this.androidPermissions.PERMISSION.READ_SMS).then(
        success => {

          //if permission granted
          this.ReadSMSList();
        },
        err => {

          this.androidPermissions.requestPermission
            (this.androidPermissions.PERMISSION.READ_SMS).
            then(success => {
              this.ReadSMSList();
            },
              err => {
                alert("cancelled")
              });
        });

    this.androidPermissions.requestPermissions
      ([this.androidPermissions.PERMISSION.READ_SMS]);

  }
  ReadSMSList() {

    this.platform.ready().then((readySource) => {

      let filter = {
        box: 'inbox', // 'inbox' (default), 'sent', 'draft'
        indexFrom: 0, // start from index 0
        maxCount: 20, // count of SMS to return each time
      };

      if (SMS) SMS.listSMS(filter, (ListSms) => {
        this.messages = ListSms
      },

        Error => {
          alert(JSON.stringify(Error))
        });

    });
  }

}
