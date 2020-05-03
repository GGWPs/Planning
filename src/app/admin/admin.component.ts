import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Map, MapboxGeoJSONFeature, MapLayerMouseEvent, SymbolLayout} from 'mapbox-gl';
import {UserService} from "../user.service";
import {Admin} from "./Admin";
import {User} from "../User";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  booking: boolean;
  users: boolean;
  add: boolean;
  map: boolean;
  email: boolean;
  isAuthenticated: boolean;
  loginError: string;
  form: FormGroup;
  public loginInvalid: boolean;
  private formSubmitAttempt: boolean;
  private returnUrl: string;
  lists;
  hide = true;


  constructor(private fb: FormBuilder, private userService: UserService) {
  }



  async ngOnInit() {

    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  toggle(type: string) {
    this.booking = false;
    this.users = false;
    this.add = false;
    this.map = false;
    this.email = false;
    if (type === 'booking') {
      this.booking = true;
    }
    if (type === 'users') {
      this.users = true;
    }
    if (type === 'add') {
      this.add = true;
    }
    if (type === 'map') {
      this.map = true;
    }
    if (type === 'email') {
      this.email = true;
    }
  }

  getAdmin(admin: Admin) {
    return new Promise(resolve => {
      this.userService.login(admin)
        .subscribe(adm => {
          console.log(adm);
          if (adm.hasOwnProperty('token')) {
            console.log('strue')
            this.isAuthenticated = true;
          }
          this.loginError = 'Password wrong!'
          resolve();
        });
    });
  }

  async onSubmit() {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.form.valid) {
      try {
        const admin = new Admin();
        admin.user = this.form.get('username').value;
        admin.password = this.form.get('password').value;
        await this.getAdmin(admin);
      } catch (err) {
        this.loginInvalid = true;
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }
}
