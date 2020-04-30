import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {BookingService} from '../booking.service';
import {Router} from '@angular/router';
import {Booking} from '../Booking';
import {formatDate} from '@angular/common';
import {UserService} from "../user.service";
import {User} from "../User";

@Component({
  selector: 'app-confirmbooking',
  templateUrl: './confirmbooking.component.html',
  styleUrls: ['./confirmbooking.component.css']
})
export class ConfirmbookingComponent implements OnInit {

  constructor(private bookingService: BookingService, private userService: UserService, private router: Router, @Inject(LOCALE_ID) private locale: string) { }
  bookingData: any;
  startTime = '';
  endTime: any;
  comment = '';
  testDate: Date;
  testDate2: Date;
  user: User;

  ngOnInit() {
    this.bookingData = this.bookingService.retrieveData();
    this.user = this.userService.getUserData();
    console.log(this.bookingData);
    if (this.bookingData === undefined) {
      this.router.navigate(['booking']);
    } else {
      for (const key in this.bookingData) {
        if (this.bookingData.hasOwnProperty(key)) {
          const value = this.bookingData[key];
          if (key === 'StartTime') {
            this.testDate = value;
            const date = value.toString().split(' ', 5);
            for (const e of date) {
              if (e !== undefined) {
                this.startTime += ' ' + e;
              }
            }
          }
          if (key === 'EndTime') {
            this.endTime = value;
            this.testDate2 = value;
          }
          if (key === 'Subject') {
            this.comment = value;
          }
        }
      }
    }
  }

  onClickMe() {
    const booking = new Booking(this.userService.getID(), this.testDate.toISOString(), this.testDate2.toISOString(), this.comment, false);
    this.addBooking(booking);
  }

  addBooking(booking: Booking) {
    this.bookingService
      .addBooking(booking)
      .subscribe(resp => {
        this.router.navigate(['thanks']);
      });
  }

}
