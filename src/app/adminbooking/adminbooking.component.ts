import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import * as XLSX from 'xlsx';
import {ActionEventArgs, ToolbarActionArgs, ExportOptions, ExcelExportService  } from '@syncfusion/ej2-angular-schedule';
import {UserService} from '../user.service';
import { ItemModel } from '@syncfusion/ej2-angular-navigations';
import {User} from '../User';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import {
  EventSettingsModel,
  DayService,
  WeekService,
  View,
  TimeScaleModel,
  ScheduleComponent,
  WorkHoursModel
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

  public timeScale: TimeScaleModel = {enable: true, interval: 60, slotCount: 12};

  public workWeekDays: number[] = [1, 2, 3, 4, 5];
  public scheduleHours: WorkHoursModel = {highlight: true, start: '8:00', end: '20:00'};
  error: boolean;
  bookings;
  users;
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
              user2.achternaam + '  DP: ' + user2.dp + '  Telefoon: ' + user2.telefoon,
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
      .then(users => {  this.loadBookings(); } )
      .catch(any2 => { console.log('rejected!');
      });
  }

  public onAddClick(): void {
    this.onCloseClick();
    const data = this.scheduleObj.getCellDetails(this.scheduleObj.getSelectedElements());
    const eventData = this.scheduleObj.eventWindow.getObjectFromFormData('e-quick-popup-wrapper');
    Object.assign(eventData, {IsBlock: true});
    this.bookingService.setData(eventData);
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
            eventData.Id = this.scheduleObj.eventBase.getEventMaxID() as number + 1;
            this.scheduleObj.addEvent(eventData);
            console.log(eventData);
          }
        }
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

  openDialog(val: number): void {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        width: '50%',
        height: '50%',
        data: {test: val}
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          if (result === 'yes') {
            this.deleteBooking(val);
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
