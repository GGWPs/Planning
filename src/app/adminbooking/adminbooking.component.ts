import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../user.service';
import { ItemModel } from '@syncfusion/ej2-angular-navigations';
import {User} from '../User';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { createElement } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import {
  EventSettingsModel,
  DayService,
  WeekService,
  View,
  TimeScaleModel,
  ScheduleComponent,
  WorkHoursModel,
  PopupOpenEventArgs
} from '@syncfusion/ej2-angular-schedule';
import {BookingService} from '../booking.service';
import {Booking} from '../Booking';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-adminbooking',
  templateUrl: './adminbooking.component.html',
  styleUrls: ['./adminbooking.component.css']
})
export class AdminbookingComponent implements OnInit {
  public data: object[] = [];
  @ViewChild('scheduleObj', {static: false})
  public scheduleObj: ScheduleComponent;
  public selectedDate: Date = new Date();
  public eventSettings: EventSettingsModel = {
    dataSource: this.data
  };
  // private calendarId: string = 'kpamkfeg6hrqssfv0jsfb2blpc@group.calendar.google.com';
  // private publicKey: string = '21fed7f4b933f378bbe902016f051fbcec2fc8be';
  // private dataManger: DataManager = new DataManager({
  //   url: 'https://www.googleapis.com/calendar/v3/calendars/' + this.calendarId + '/events?key=' + this.publicKey,
  //   adaptor: new WebApiAdaptor,
  //   crossDomain: true
  // });
  // public eventSettings: EventSettingsModel = { dataSource: this.dataManger };

  public timeScale: TimeScaleModel = {enable: true, interval: 60, slotCount: 1};

  public workWeekDays: number[] = [1, 2, 3, 4, 5];
  public scheduleHours: WorkHoursModel = {highlight: true, start: '8:00', end: '20:00'};
  error: boolean;
  bookings;
  users;
  selectedUser;
  comment;
  endTime;
  startTime;
  userID;

  constructor(private bookingService: BookingService, private userService: UserService, public dialog: MatDialog) { }

  async ngOnInit() {
    this.loadBookings();
    await this.getUsers();
  }

  async loadBookings() {
    await this.getBookings();
    if (Array.isArray(this.bookings.bookings) && this.bookings.bookings.length) {
      for (const booking of this.bookings.bookings) {
        this.getUser(booking);
      }
    }
  }
  getUser(booking: Booking) {
    return new Promise(resolve => {
      this.userService.getUser(booking.id)
        .subscribe(user => {
          const user2 = user as User;
          this.data.push({
            Id: this.data.length + 1,
            Subject: user2.adres + ' ' + user2.huisnr + ' Naam: ' +
              user2.achternaam + '  DP: ' + user2.dp + '  Telefoon: ' + user2.telefoon + ' Opmerking: ' + booking.comment,
            StartTime: new Date(booking.start),
            EndTime: new Date(booking.end),
            bookingID: booking.bookingID
          });
          this.userService.setUser(user);
          resolve();
        });
    });
  }

  deleteBooking(id: number) {
    this.bookingService.removeBooking(id)
      .then(users => { this.data = []; this.loadBookings(); } )
      .catch(any2 => { console.log('rejected!');
      });
  }

  changeTimeScale(scale: number) {
    this.timeScale = {enable: true, interval: 60, slotCount: scale};
  }

  public onAddClick(): void {
    this.onCloseClick();
    const data = this.scheduleObj.getCellDetails(this.scheduleObj.getSelectedElements());
    const eventData = this.scheduleObj.eventWindow.getObjectFromFormData('e-quick-popup-wrapper');
    Object.assign(eventData, {user: this.selectedUser});
    this.scheduleObj.eventWindow.convertToEventData(data as { [key: string]: any }, eventData);
    for (const key in eventData) {
      if (eventData.hasOwnProperty(key)) {
        const value = eventData[key];
        if (key === 'StartTime') {
          const currentDate = new Date();
          const appointmentDate = new Date(value.toString());
          if (currentDate > appointmentDate) {
            this.error = true;
          } else {
            this.error = false;
            this.startTime = value;
            console.log(eventData);
          }
        }
        if (key === 'EndTime') {
              this.endTime = value;
         }
        if (key === 'Subject') {
            this.comment = value;
         }
        if (key === 'user') {
          this.userID = value;
        }
      }
    }
    console.log(this.selectedUser);
    eventData.Id = this.scheduleObj.eventBase.getEventMaxID() as number + 1;
    this.scheduleObj.addEvent(eventData);
    if (this.userID !== undefined) {
      const booking = new Booking(this.userID, this.startTime.toISOString(), this.endTime.toISOString(), this.comment, false);
      this.addBooking(booking);
    }
  }

  addBooking(booking: Booking) {
    this.bookingService
      .addBooking(booking)
      .subscribe(resp => {
      });
  }


  getUserList() {
    const datasource = [];
    this.users.forEach(user => {datasource.push({text: user.adres + ' ' + user.huisnr + ' ' + user.email, value: user.id}); });
    return datasource;
  }

  onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.type === 'Editor') {
      // Create required custom elements in initial time
      if (!args.element.querySelector('.custom-field-row')) {
        const row: HTMLElement = createElement('div', {className: 'custom-field-row'});
        const formElement: HTMLElement = args.element.querySelector('.e-schedule-form');
        formElement.firstChild.insertBefore(row, args.element.querySelector('.e-title-location-row'));
        const container: HTMLElement = createElement('div', {className: 'custom-field-container'});
        const inputEle: HTMLInputElement = createElement('input', {
          className: 'e-field', attrs: {name: 'User List'}
        }) as HTMLInputElement;
        container.appendChild(inputEle);
        row.appendChild(container);
        const dropDownList: DropDownList = new DropDownList({
          dataSource: this.getUserList(),
          fields: {text: 'text', value: 'value'},
          value: ( (args.data) as { [key: string]: any }).EventType as string,
          floatLabelType: 'Always', placeholder: 'User List'
        });
        dropDownList.appendTo(inputEle);
        inputEle.setAttribute('name', 'EventType');
      }
    }
  }


  public onCloseClick(): void {
    this.scheduleObj.quickPopup.quickPopupHide();
  }


  getBookings() {
    return new Promise(resolve => {
      this.bookingService.getBookings()
        .subscribe(bookings => {
          this.bookings = bookings;
          resolve();
        });
    });
  }

  getUsers() {
    return new Promise(resolve => {
      this.userService.getUsers()
        .subscribe(users => {
          this.users = users.userArray;
          resolve();
        });
    });
  }

  openDialog(bookingID: number, eventID: number): void {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        width: '35%',
        height: '25%',
        data: {test: bookingID}
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          if (result === 'yes') {
            this.scheduleObj.deleteEvent(eventID);
            this.deleteBooking(bookingID);
          }
        }
      });
  }

}

@Component({
  selector: 'DialogConfirm',
  templateUrl: 'dialog2.html',
})
export class DialogConfirmComponent {

  constructor(public dialogRef: MatDialogRef<DialogConfirmComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close('no');
  }

  onYesClick() {
    this.dialogRef.close('yes');
  }
}
