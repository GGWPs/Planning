import {Component, OnInit, ViewChild} from '@angular/core';
import { L10n } from '@syncfusion/ej2-base';
import {
  EventSettingsModel,
  DayService,
  WeekService,
  View,
  ScheduleComponent,
  WorkHoursModel
} from '@syncfusion/ej2-angular-schedule';
import {
  TimelineMonthService,
  MonthService,
  AgendaService,
  TimeScaleModel,
  PopupOpenEventArgs
} from '@syncfusion/ej2-angular-schedule';
import {ButtonComponent} from '@syncfusion/ej2-angular-buttons';
import {BookingService} from '../booking.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../user.service';

L10n.load({
  'en-US': {
    schedule: {
      addTitle : 'Kommentar'
    }
  }
});

@Component({
  selector: 'app-booking',
  providers: [DayService, WeekService, MonthService, AgendaService, TimelineMonthService],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  @ViewChild('scheduleObj', {static: false})
  public scheduleObj: ScheduleComponent;
  @ViewChild('addButton', {static: false})
  public addButton: ButtonComponent;
  public workWeekDays: number[] = [1, 2, 3, 4, 5];
  public scheduleHours: WorkHoursModel = {highlight: true, start: '8:00', end: '20:00'};
  error: boolean;
  id: string;
  bookings;
  user;
  test = '12:00';



  public data: object[] = [{
    Id: 2,
    Subject: 'Busy',
    StartTime: new Date(2020, 3, 20, 13, 0),
    EndTime: new Date(2020, 3, 20, 13, 5),
    IsBlock: true,
  },
    // {
    //   Id: 3,
    //   Subject: 'Non Working Hours',
    //   StartTime: new Date(2019, 1, 1, 20, 0),
    //   EndTime: new Date(2019, 1, 2, 8, 0),
    //   RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;',
    //   IsBlock: true
    // }
    ];
  public selectedDate: Date = new Date();
  public eventSettings: EventSettingsModel = {
    dataSource: this.data
  };
  public timeScale: TimeScaleModel = {enable: true, interval: 60, slotCount: 12};
  public scheduleViews: View[] = ['WorkWeek'];

  constructor(private bookingService: BookingService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute) {}

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id !== null) {
      this.userService.setID(this.id);
      await this.getUser(this.id);
      if (this.user.booked === 'true') {
        this.router.navigate(['booked']);
      }
      // this.getTimeSlotsByUser(this.user.timeslotEnd.split(':'), this.user.timeslotStart.split(':'));
      this.scheduleHours = {highlight: true, start: this.user.timeslotStart, end: this.user.timeslotEnd};
      await this.getBookings();
      for (const booking of this.bookings.bookings) {
        this.data.push({
          Id: this.data.length + 1,
          Subject: 'Besetz',
          StartTime: new Date(booking.start),
          EndTime: new Date(booking.end),
          IsBlock: true,
        });
        console.log(this.data);
      }
    } else {
      this.router.navigate(['NotFound']);
    }
  }

  //
  // getTimeSlotsByUser(val: any, val2: any) {
  //   this.data.push({
  //     Id: 4,
  //     Subject: 'Time not available!',
  //     StartTime: new Date(2019, 1, 1, val[0], val[1]),
  //     EndTime: new Date(2019, 1, 2, val2[0], val[1]),
  //     RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;',
  //     IsBlock: true
  //   });
  // }

  getBookings() {
    return new Promise(resolve => {
      this.bookingService.getBookings()
        .subscribe(bookings => {
          this.bookings = bookings;
          resolve();
        });
    });
  }

  getUser(id: string) {
    return new Promise(resolve => {
      this.userService.getUser(id)
        .subscribe(user => {
          this.user = user;
          this.userService.setUser(user);
          resolve();
        });
    });
  }

  onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.type === 'Editor') {
      args.cancel = true;
    }
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
            this.router.navigate(['confirmbooking']);
          }
        }
      }
    }
  }

  public onCloseClick(): void {
    this.scheduleObj.quickPopup.quickPopupHide();
  }


}
