import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import {User} from '../User';
import {UserService} from '../user.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Admin} from "../admin/Admin";

@Component({
  selector: 'app-adminadd',
  templateUrl: './adminadd.component.html',
  styleUrls: ['./adminadd.component.css']
})
export class AdminaddComponent implements OnInit {

  willDownload = false;
  userDataArray;
  added = 0;
  listName: string;
  form: FormGroup;

  constructor(private userService: UserService, private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.email],
      postcode: [''],
      plaats: [''],
      adres: [''],
      huisnr: [''],
      huisext: [''],
      kamer: [''],
      achternaam: [''],
      telefoon: [''],
      mobiel: [''],
      sbouw: [''],
      apop: [''],
      dp: [''],
      oplever: [''],
      reden: [''],
      geschouwd: [''],
      lijst: ['Manual']
    });
  }

  onFileChange(ev) {
    this.listName = ev.target.files[0].name;
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      const dataString = JSON.stringify(jsonData);
      this.userDataArray = jsonData.A;
      this.setDownload(dataString);
    };
    reader.readAsBinaryString(file);
  }

  changeList(ev) {
    this.listName = ev.target.value;
  }


  setDownload(data) {
    this.willDownload = true;
    // setTimeout(() => {
    //   const el = document.querySelector('#download');
    //   el.setAttribute('href', `data:text/json;charset=utf-8,${encodeURIComponent(data)}`);
    //   el.setAttribute('download', 'xlsxtojson.json');
    // }, 1000);
  }


  insert() {
    for (const userData of this.userDataArray) {
      const user = new User();
      if (userData.hasOwnProperty('Postcode')) {
        user.postcode = userData.Postcode;
      }
      if (userData.hasOwnProperty('Plaats')) {
        user.plaats = userData.Plaats;
      }
      if (userData.hasOwnProperty('Adres')) {
        user.adres = userData.Adres;
      }
      if (userData.hasOwnProperty('Huisnummer')) {
        user.huisnr = userData.Huisnummer;
      }
      if (userData.hasOwnProperty('Huisext')) {
        user.huisext = userData.Huisext;
      }
      if (userData.hasOwnProperty('Kamer')) {
        user.kamer = userData.Kamer;
      }
      if (userData.hasOwnProperty('Achternaam')) {
        user.achternaam = userData.Achternaam;
      }
      if (userData.hasOwnProperty('Telefoon')) {
        user.telefoon = userData.Telefoon.toString();
      }
      if (userData.hasOwnProperty('Mobiel')) {
        user.mobiel = userData.Mobiel.toString();
      }
      if (userData.hasOwnProperty('Soort_bouw')) {
        user.sbouw = userData.Soort_bouw;
      }
      if (userData.hasOwnProperty('Areapop')) {
        user.areapop = userData.Areapop;
      }
      if (userData.hasOwnProperty('DP')) {
        user.dp = userData.DP;
      }
      if (userData.hasOwnProperty('redenNA')) {
        user.redenNA = userData.redenNA;
      }
      if (userData.hasOwnProperty('Opleverstatus')) {
        user.opleverstatus = userData.Opleverstatus.toString();
      }
      if (userData.hasOwnProperty('Geschouwd')) {
        user.geschouwd = userData.Geschouwd.toString();
      }
      if (userData.hasOwnProperty('email')) {
        user.email = userData.email;
      }
      user.fileName = this.listName;
      if (user.email !== undefined || user.achternaam !== undefined && user.telefoon !== undefined) {
        this.addUser(user);
      }
    }
  }

  // insert() {
  //   const users = [];
  //   for (const userData of this.userDataArray) {
  //     const user = new User();
  //     if (userData.hasOwnProperty('Postcode')) {
  //       user.postcode = userData.Postcode;
  //     }
  //     if (userData.hasOwnProperty('Plaats')) {
  //       user.plaats = userData.Plaats;
  //     }
  //     if (userData.hasOwnProperty('Adres')) {
  //       user.adres = userData.Adres;
  //     }
  //     if (userData.hasOwnProperty('Huisnummer')) {
  //       user.huisnr = userData.Huisnummer;
  //     }
  //     if (userData.hasOwnProperty('Kamer')) {
  //       user.kamer = userData.Kamer;
  //     }
  //     if (userData.hasOwnProperty('Achternaam')) {
  //       user.achternaam = userData.Achternaam;
  //     }
  //     if (userData.hasOwnProperty('Telefoon')) {
  //       user.telefoon = userData.Telefoon;
  //     }
  //     if (userData.hasOwnProperty('Mobiel')) {
  //       user.mobiel = userData.Mobiel;
  //     }
  //     if (userData.hasOwnProperty('Soort_bouw')) {
  //       user.sbouw = userData.Soort_bouw;
  //     }
  //     if (userData.hasOwnProperty('Areapop')) {
  //       user.areapop = userData.Areapop;
  //     }
  //     if (userData.hasOwnProperty('DP')) {
  //       user.dp = userData.DP;
  //     }
  //     if (userData.hasOwnProperty('redenNA')) {
  //       user.redenNA = userData.redenNA;
  //     }
  //     if (userData.hasOwnProperty('Opleverstatus')) {
  //       user.opleverstatus = userData.Opleverstatus.toString();
  //     }
  //     if (userData.hasOwnProperty('Geschouwd')) {
  //       user.geschouwd = userData.Geschouwd.toString();
  //     }
  //     if (userData.hasOwnProperty('email')) {
  //       user.email = userData.email;
  //     }
  //     if (user.email !== undefined || user.achternaam !== undefined && user.telefoon !== undefined) {
  //       users.push(user);
  //     }
  //   }
  //   // this.addUsers(users);
  //   this.splitArray(users);
  // }

  addUser(user: User) {
    this.userService
      .addUser(user)
      .subscribe(resp => {
        if (resp.telefoon !== undefined) {
          this.added++;
        }
      });
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        console.log(this.form);
        const user = new User();
        user.postcode = this.form.get('postcode').value;
        user.plaats = this.form.get('plaats').value;
        user.adres = this.form.get('adres').value;
        user.huisnr = Number(this.form.get('huisnr').value);
        user.huisext =  this.form.get('huisext').value;
        user.kamer = this.form.get('kamer').value;
        user.achternaam = this.form.get('achternaam').value;
        user.telefoon = this.form.get('telefoon').value;
        user.mobiel = this.form.get('mobiel').value;
        user.sbouw = this.form.get('sbouw').value;
        user.areapop = this.form.get('apop').value;
        user.dp = this.form.get('dp').value;
        user.opleverstatus = this.form.get('oplever').value;
        user.redenNA = this.form.get('reden').value;
        user.geschouwd = this.form.get('geschouwd').value;
        user.email = this.form.get('email').value;
        user.fileName = this.form.get('lijst').value;
        this.addUser(user);
      } catch (err) {

      }
    } else {

    }
  }

  // async splitArray(users: User[]) {
  //   const a = users;
  //   while (a.length) {
  //     await this.addUsers(a.splice(0, 100));
  //   }
  // }
  //
  // async  addUsers(users: User[]) {
  //   this.userService
  //     .addUsers(users)
  //     .subscribe(resp => {
  //       console.log('added!');
  //     });
  // }
}
