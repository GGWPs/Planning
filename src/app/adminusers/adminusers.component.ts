import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource, MatPaginator, MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {User} from '../User';
import {UserService} from '../user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


export interface DialogData {
  name: string;
}


@Component({
  selector: 'app-adminusers',
  templateUrl: './adminusers.component.html',
  styleUrls: ['./adminusers.component.css']
})
export class AdminusersComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  public dataSource = new MatTableDataSource<User>();
  public displayedColumns = ['name', 'telefoon', 'adres', 'huisnr', 'email', 'DP', 'emailsent', 'booked?', 'done', 'file', 'details', 'update', 'delete'
  ];

  users;
  user;
  lists;

  filterUser;


  constructor(private userService: UserService, public dialog: MatDialog) { }

  async ngOnInit() {
    await this.getUsers();
    await this.getLists();
  }


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  filterList(val) {
    console.log(val);
    this.dataSource.filter = val.toString();
    // this.dataSource.data = this.dataSource.data.filter((unit) => unit.fileName.indexOf(val) > -1);
  }
  getUsers() {
    return new Promise(resolve => {
      this.userService.getUsers()
        .subscribe(users => {
          this.users = users;
          this.dataSource.data = users.userArray;
          resolve();
        });
    });
  }

  getLists() {
    return new Promise(resolve => {
      this.userService.getLists()
        .subscribe(lists => {
          this.lists = lists;
          resolve();
        });
    });
  }

  getUser(id: string) {
    return new Promise(resolve => {
      this.userService.getUser(id)
        .subscribe(user => {
          this.user = user;
          resolve();
        });
    });
  }

  getUserToDelete(id: string) {
    return new Promise(resolve => {
      this.userService.getUser(id)
        .subscribe(user => {
          this.user = user;
          this.openDialog('deleteUser', '');
          resolve();
        });
    });
  }

  openDialog(val: string, val2: any): void {
    if (val === 'user') {
      const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
        width: '40%',
        height: '70%',
        data: {user: this.user}
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          if (result) {
            this.getUsers();
            this.getLists();
          }
        }
      });
    }
    let dialog;
    if (val === 'deleteList') {
      dialog = this.dialog.open(DialogDeleteComponent, {
        width: '40%',
        height: '25%',
        data: {list: val2}
      });
      dialog.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.lists = result;
        }
        });
    }
    if (val === 'deleteUser') {
      dialog = this.dialog.open(DialogDeleteUserComponent, {
        width: '40%',
        height: '25%',
        data: {user: this.user}
      });
      dialog.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.users = result;
          this.dataSource.data = result.userArray; }
        });
    }

    if (val === 'emailUser') {
      dialog = this.dialog.open(DialogEmailUserComponent, {
        width: '40%',
        height: '40%',
        data: {user: this.user}
      });
      dialog.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.getUsers(); }
      });
    }
  }


  public redirectToDetails = (val: User) => {
    this.user = val;
    this.openDialog('user', '');
  }

  public redirectToEmail = (user: User) => {
    this.user = user;
    this.openDialog('emailUser', '');
  }

  public redirectToDelete = (user: User) => {
    this.user = user;
    this.openDialog('deleteUser', '');
    // this.getUserToDelete(id);
  }

  delete(val: any) {
    this.openDialog('deleteList', val);
  }
}



@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {
  editMode: boolean;
  form: FormGroup;
  edited: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService,
    private fb: FormBuilder) {
    this.form = this.fb.group({
      email: [data.user.email, Validators.email],
      postcode: [data.user.postcode],
      plaats: [data.user.plaats],
      adres: [data.user.adres],
      huisnr: [data.user.huisnr],
      huisext: [data.user.huisext],
      kamer: [data.user.kamer],
      achternaam: [data.user.achternaam],
      telefoon: [data.user.telefoon],
      mobiel: [data.user.mobiel],
      sbouw: [data.user.sbouw],
      apop: [data.user.areapop],
      dp: [data.user.dp],
      oplever: [data.user.opleverstatus],
      reden: [data.user.redenNA],
      geschouwd: [data.user.geschouwd],
      lijst: [data.user.fileName]
    });
  }


  onNoClick(): void {
    this.dialogRef.close(this.edited);
  }

  edit() {
    this.editMode = true;
  }

  back() {
    this.editMode = false;
  }

  editUser(user: User) {
    this.userService.updateUser(user)
      .then(user2 => {this.editMode = false; this.data.user = user2; this.edited = true; })
      .catch(any2 => { console.log('rejected!');
      });
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        const user = new User();
        user.postcode = this.form.get('postcode').value;
        user.plaats = this.form.get('plaats').value;
        user.adres = this.form.get('adres').value;
        user.huisnr = Number(this.form.get('huisnr').value);
        user.huisext = this.form.get('huisext').value;
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
        user.id = this.data.user.id;
        await this.editUser(user);
      } catch (err) {

      }
    } else {

    }
  }
}


@Component({
  selector: 'DialogDelete',
  templateUrl: 'delete.html',
})
export class DialogDeleteComponent {

  constructor(private userService: UserService,
              public dialogRef: MatDialogRef<DialogDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  delete(val: string) {
    this.userService.removeList(val)
      .then(lists => this.dialogRef.close(lists))
      .catch(any2 => { console.log('rejected!');
      });
  }
}

@Component({
  selector: 'DialogDeleteUser',
  templateUrl: 'deleteuser.html',
})
export class DialogDeleteUserComponent {

  constructor(private userService: UserService,
              public dialogRef: MatDialogRef<DialogDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  delete(val: string) {
    this.userService.removeUser(val)
      .then(users => this.dialogRef.close(users))
      .catch(any2 => { console.log('rejected!');
      });
  }
}

@Component({
  selector: 'DialogEmailUser',
  templateUrl: 'emailuser.html',
})
export class DialogEmailUserComponent {

  start: string;
  end: string;
  emailed: boolean;

  timeslots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
  constructor(private userService: UserService,
              public dialogRef: MatDialogRef<DialogEmailUserComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { this.start = '08:00';  this.end = '20:00'; }

  onNoClick(): void {
    this.dialogRef.close();
  }

  email() {
    if (!this.emailed) {
      this.emailed = true;
      this.data.user.timeslotStart = this.start;
      this.data.user.timeslotEnd = this.end;
      this.userService
        .emailUser(this.data.user)
        .subscribe(resp => {
          this.dialogRef.close('emailed');
        });
    }
  }
}
