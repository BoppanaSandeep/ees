export class shareComponent {
  public email_url = "http://198.168.0.114/phpmail/";
  public unixTimestamp = Math.round(
    new Date("Mon, 25 Dec 2017 01:00:00 GMT").getTime() / 1000
  );
  public previous_time = this.unixTimestamp;
  // public filters: any = [
  //   {
  //     name: "type",
  //     value: "MISSED_TYPE",
  //     operator: "like"
  //   },
  //   {
  //     name: "date",
  //     value: this.convertTimestamp(this.previous_time),
  //     operator: ">="
  //   }
  // ];

  public filters: any = [
    {
      name: "type",
      value: 3,
      operator: "like"
    },
    {
      name: "date",
      value: 1522232800197,
      operator: ">="
    }
  ];

  public convertTimestamp(unixTimestamp) {
    var d = new Date(unixTimestamp * 1000), // Convert the passed timestamp to milliseconds
      yyyy = d.getFullYear(),
      mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
      dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
      hh = d.getHours(),
      h = hh,
      min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
      ampm = "AM",
      time;

    if (hh > 12) {
      h = hh - 12;
      ampm = "PM";
    } else if (hh === 12) {
      h = 12;
      ampm = "PM";
    } else if (hh == 0) {
      h = 12;
    }

    // ie: 2013-02-18, 8:35 AM
    time = yyyy + "-" + mm + "-" + dd + ", " + h + ":" + min + " " + ampm;

    return time;
  }
}
