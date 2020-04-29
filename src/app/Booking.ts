
export class Booking {
  id: string;
  start: string;
  end: string;
  comment: string;
  confirmed: boolean;


  constructor(id: string, start: string, end: string, comment: string, confirmed: boolean) {
    this.id = id;
    this.start = start;
    this.end = end;
    this.comment = comment;
    this.confirmed = confirmed;
  }
}
