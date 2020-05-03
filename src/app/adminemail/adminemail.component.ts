import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../User';
import {FilteradresPipe} from '../filteradres.pipe';

@Component({
  selector: 'app-adminemail',
  templateUrl: './adminemail.component.html',
  styleUrls: ['./adminemail.component.css']
})
export class AdminemailComponent implements OnInit {
  users: User[];
  streets = [];
  filteredUsers: User[];
  selectedUsers = [];
  selectedDays = [];
  emailed: boolean;
  timeslots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
  start: string;
  end: string;
  emailedUsers = 0;
  error: string;
  message: string;
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  constructor(private userService: UserService) { }

  async ngOnInit() {
    this.start = '08:00';
    this.end = '20:00';
    await this.getUsers();
    this.filteredUsers = this.users;
    this.users.forEach(user => {if (!this.streets.includes(user.adres)) {
                                            this.streets.push(user.adres);
        }
      }
    );
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

  onSelection(e, v) {
    this.message = '';
    this.selectedUsers = [];
    for (const a of v) {
      this.selectedUsers.push(a.value);
    }
  }

  onSelectionDay(e, v) {
    this.selectedDays = [];
    for (const a of v) {
      if (a.value === ('Monday')) {
          this.selectedDays.push(1);
      } else if (a.value === ('Tuesday')) {
         this.selectedDays.push(2);
      } else if (a.value === ('Wednesday')) {
          this.selectedDays.push(3);
      } else if (a.value === ('Thursday')) {
          this.selectedDays.push(4);
      } else if (a.value === ('Friday')) {
          this.selectedDays.push(5);
      }
    }
  }

  filterUsers(street: string) {
    this.filteredUsers = this.users;
    this.filteredUsers = new FilteradresPipe().transform(this.filteredUsers, street);
  }

  email() {
    if (this.start < this.end) {
      this.emailedUsers = 0;
      if (Array.isArray(this.selectedUsers) && this.selectedUsers.length) {
        if (!this.emailed) {
          this.emailed = true;
          this.message = 'emailing...' + this.selectedUsers.length + ' user(s)';
          this.selectedUsers.forEach(user => {
            user.timeslotStart = this.start;
            user.timeslotEnd = this.end;
            if (Array.isArray(this.selectedDays) && this.selectedDays.length) {
              user.days = this.selectedDays;
            } else {
              user.days = [1, 2, 3, 4, 5];
            }
            this.userService
              .emailUser(user)
              .subscribe(resp => {
                this.emailedUsers++;
                if (this.selectedUsers.length === this.emailedUsers) {
                  this.message = 'Emailed ' + this.emailedUsers + ' users';
                  this.emailed = false;
                }
              });
          });
        }
      }
      } else {
      this.error = 'Start time cannot be before end time!';
    }
  }



}
