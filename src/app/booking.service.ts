import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {Booking} from './Booking';
import {Observable, of} from 'rxjs';
import { environment } from './../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  bookingData: any;
  private readonly token = '?token=' + environment.token;
  readonly host = environment.API_URL;
  readonly bookingsUrl =  this.host + '/bookings';
  readonly addBookingUrl = this.host + '/bookings/addbooking';

  constructor(private readonly http: HttpClient) { }

  setData(data: any) {
    this.bookingData = data;
  }

  retrieveData() {
    return this.bookingData;
  }

  getBookings() {
    return this.http.get<Booking[]>(this.bookingsUrl + this.token)
      .pipe(
        tap(_ => this.log('fetched all bookings')),
        catchError(this.handleError('getBookings', []))
      );
  }

  addBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.addBookingUrl + this.token, booking, httpOptions)
      .pipe(
        catchError(this.handleError('addBooking', booking))
      );
  }

  addBookings(bookings: Booking[]): Observable<Booking[]> {
    return this.http.post<Booking[]>(this.addBookingUrl + 's' + this.token, bookings, httpOptions)
      .pipe(
        catchError(this.handleError('addBookings', bookings))
      );
  }

  public async removeBooking(id: number): Promise<Booking[]> {
    const url = `${this.bookingsUrl}/${id}` + this.token;
    try {
      const data: Booking[] = await this.http.delete<Booking[]>(url, httpOptions).toPromise();
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  }



  private log(message: string) {
    const messageString = `BookingService: ${message}`;

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
}
