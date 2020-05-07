
export class Booking {
  bookingID: string;
  id: string;
  start: string;
  end: string;
  comment: string;
  confirmed: boolean;
  street: string;


  constructor(id: string, start: string, end: string, comment: string, confirmed: boolean) {
    this.id = id;
    this.start = start;
    this.end = end;
    this.comment = comment;
    this.confirmed = confirmed;
  }
}
