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
  PopupOpenEventArgs, RenderCellEventArgs, ActionEventArgs
} from '@syncfusion/ej2-angular-schedule';
import {BookingService} from '../booking.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../user.service';
import {formatDate} from '@angular/common';
import { createElement } from '@syncfusion/ej2-base';

L10n.load({
  'en-US': {
    schedule: {
      addTitle : 'Kommentar',
      saveButton: 'hinzufugen',
      newEvent: 'hinzufügen'
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
  public workWeekDays: number[] = [1, 2, 3, 4, 5];
  public scheduleHours: WorkHoursModel = {highlight: true, start: '8:00', end: '20:00'};
  error: boolean;
  id: string;
  bookings;
  user;
  limit = 8;
  numArray = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  countArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


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
  public timeScale: TimeScaleModel = {enable: true, interval: 60, slotCount: 1};
  public scheduleViews: View[] = ['WorkWeek', 'Month'];

  constructor(private bookingService: BookingService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute) {}

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id !== null) {
      this.userService.setID(this.id);
      await this.getUser(this.id);
      if (this.user === null) {
        this.router.navigate(['NotFound']);
      } else if (this.user.booked === 'check') {
        this.router.navigate(['booked']);
      }
      if (Array.isArray(this.user.days) && this.user.days.length) {
        this.workWeekDays = this.user.days;
      }
      if (this.user.timeslotStart !== undefined) {
        this.scheduleHours = {highlight: true, start: this.user.timeslotStart, end: this.user.timeslotEnd};
      }
      console.log(this.user);
      await this.getBookings();
      let full = false;
      for (const booking of this.bookings.bookings) {
        const indexHour = this.numArray.indexOf(new Date(booking.start).getHours());
        this.countArray[indexHour]++;
        if (this.countArray[indexHour] >= this.limit) {
          full = true;
        }
        if (full) {
          this.data.push({
            Id: this.data.length + 1,
            Subject: 'Besetz',
            StartTime: new Date(booking.start),
            EndTime: new Date(booking.end),
            IsBlock: full,
          });
        }
      }
    } else {
      this.router.navigate(['NotFound']);
    }
  }

  OnEventRendered(args) {
    // The below code examples used to apply the background color to the appointments
    let categoryColor;
    if (args.data.Street === 'Tolhuis') {
      categoryColor = 'green';
    } else if (args.data.Street === 'UnAssigned') {
      categoryColor = 'red';
    }
    args.element.style.backgroundColor = categoryColor;
  }

  // test(val: any) {
  //   console.log('called!' + val);
  // }
  // getMajorTime(date: Date): string {
  //   // return this.instance.formatDate(date, { skeleton: 'hm' });
  //   // return formatDate(date,{ skeleton: 'hm' }, locale);
  //   // return date.getHours().toString();
  //
  //   return '<a>'
  // }

  onRenderCell(args: RenderCellEventArgs): void {
    if (args.elementType === 'workCells' || args.elementType === 'monthCells') {
      const weekEnds: number[] = [1, 6];
      if (weekEnds.indexOf((args.date).getDay()) >= 0) {
        const ele: HTMLElement = createElement('div', {
          innerHTML: '<img src=\'https://ej2.syncfusion.com/demos/src/schedule/images/newyear.svg\' />',
          className: 'templatewrap'
        });
        (args.element).appendChild(ele);
      }
    }
  }

  getMonthCellText(date: Date): string {
    if (date.getMonth() === 4 && date.getDate() === 5) {
      return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/birthday.svg" />';
    } else if (date.getMonth() === 4 && date.getDate() === 6) {
      return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/get-together.svg" />';
    } else if (date.getMonth() === 4 && date.getDate() === 13) {
      return '<img src= "https://ej2.syncfusion.com/demos/src/schedule/images/birthday.svg" />';
    }
    return '';
  }

  getWorkCellText(date: Date): string {
    const weekEnds: number[] = [0, 6];
    if (date.getMonth() === 4 && date.getDate() === 13) {
      return '<img src=\'https://ej2.syncfusion.com/demos/src/schedule/images/newyear.svg\' />';
    }
    return '';
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
      const statusElement: HTMLInputElement = args.element.querySelector('#EventType') as HTMLInputElement;
      // let startElement: HTMLInputElement = args.element.querySelector('#StartTime') as HTMLInputElement;
      // if (!startElement.classList.contains('e-datetimepicker')) {
      //   new DateTimePicker({ value: new Date(startElement.value) || new Date() }, startElement);
      // }
      // let endElement: HTMLInputElement = args.element.querySelector('#EndTime') as HTMLInputElement;
      // if (!endElement.classList.contains('e-datetimepicker')) {
      //   new DateTimePicker({ value: new Date(endElement.value) || new Date() }, endElement);
      // }
      // let startElement: HTMLInputElement = args.element.querySelector('#StartTime') as HTMLInputElement;
      // if (!startElement.classList.contains('e-datetimepicker')) {
      //   new DateTimePicker({ value: new Date(startElement.value) || new Date() }, startElement);
      // }
      // let endElement: HTMLInputElement = args.element.querySelector('#EndTime') as HTMLInputElement;
      // if (!endElement.classList.contains('e-datetimepicker')) {
      //   new DateTimePicker({ value: new Date(endElement.value) || new Date() }, endElement);
      // }
      // let processElement: HTMLInputElement= args.element.querySelector('#OwnerId');
      // if (!processElement.classList.contains('e-multiselect')) {
      //   let multiSelectObject: MultiSelect = new MultiSelect({
      //     placeholder: 'Choose a owner',
      //     fields: { text: 'text', value: 'id'},
      //     dataSource: <any>this.ownerDataSource,
      //     value: <string[]>((args.data.OwnerId instanceof Array) ? args.data.OwnerId : [args.data.OwnerId])
      //   });
      //   multiSelectObject.appendTo(processElement);
      // }
    }
  }

  onActionBegin(args: ActionEventArgs): void {
    if (args.requestType === 'eventCreate') { // while creating new event
      const eventData = args.data[0];
      this.bookingService.setData(eventData);
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
              if (eventData.Subject === 'Kommentar') {
                eventData.Subject = '';
              }
              this.router.navigate(['confirmbooking']);
            }
          }
        }
      }
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
