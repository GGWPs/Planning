import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Booking} from './Booking';
import {catchError, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {User} from './User';
import {Admin} from './admin/Admin';
import {Lists} from './Lists';
import { environment } from './../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly host = environment.API_URL;
  private readonly token = '?token=' + environment.token;
  readonly userUrl =  this.host + '/user';
  readonly addUserUrl =  this.host + '/user/adduser';
  readonly emailUserUrl =  this.host + '/user/emailuser';
  readonly getUserUrl =  this.host + '/user/';
  readonly getAdmin =  this.host + '/user/admin';
  readonly listUrl =  this.host + '/user/lists';
  readonly delListUrl =  this.host + '/user/lists';
  readonly delUserUrl =  this.host + '/user';
  user: User;
  id: string;
  public change: EventEmitter<any> = new EventEmitter();

  constructor(private readonly http: HttpClient) { }

  getUser(id: string) {
    return this.http.get<User>(this.getUserUrl + id)
      .pipe(
        tap(_ => this.log('fetched user')),
        catchError(this.handleError('getUser', []))
      );
  }


  getUsers() {
    return this.http.get<any>(this.userUrl + this.token)
      .pipe(
        tap(_ => this.log('fetched all users')),
        catchError(this.handleError('getUsers', []))
      );
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.addUserUrl, user, httpOptions)
      .pipe(
        catchError(this.handleError('addUser', user))
      );
  }

  addUsers(users: User[]): Observable<User[]> {
    return this.http.post<User[]>(this.addUserUrl + 's', users, httpOptions)
      .pipe(
        catchError(this.handleError('addUser', users))
      );
  }


  public async updateUser(user: User): Promise<User> {
    const url = `${this.userUrl}/${user.id}`;
    console.log(url);
    try {
      const data: User = await this.http.put<User>(url, user, httpOptions).toPromise();
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  emailUser(user: User): Observable<User> {
    return this.http.post<User>(this.emailUserUrl, user, httpOptions)
      .pipe(
        catchError(this.handleError('emailUser', user))
      );
  }


  private log(message: string) {
    const messageString = `UserService: ${message}`;

    // this.messageService.add(messageString);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      const errorMessage = `${operation} failed: ${error.message}`;

      this.log(errorMessage);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  login(admin: Admin): Observable<Admin>  {
    return this.http.post<Admin>(this.getAdmin, admin, httpOptions)
      .pipe(
        catchError(this.handleError('getAdmin', admin))
      );
  }

  getLists() {
    return this.http.get<any>(this.listUrl)
      .pipe(
        tap(_ => this.log('fetched all lists')),
        catchError(this.handleError('getLists', []))
      );
  }


  public async removeList(list: string): Promise<Lists> {
    const url = `${this.delListUrl}/${list}`;
    console.log(url);
    try {
      const data: Lists = await this.http.delete<Lists>(url, httpOptions).toPromise();
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async removeUser(user: string): Promise<User[]> {
    const url = `${this.delUserUrl}/${user}`;
    try {
      const data: User[] = await this.http.delete<User[]>(url, httpOptions).toPromise();
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  setUser(user: any) {
    this.user = user;
  }

  getUserData() {
    return this.user;
  }

  setID(id: string) {
    this.id = id;
  }

  getID() {
    return this.id;
  }


  public setData(value) {
    this.change.emit(value);
  }

}
