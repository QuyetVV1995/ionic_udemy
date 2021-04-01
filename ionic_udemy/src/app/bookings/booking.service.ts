import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { take,tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { Booking } from "./booking.model";

@Injectable({providedIn: 'root'})
export class BookingService{
  private _bookings = new BehaviorSubject<Booking[]>([]);

  get bookings(){
    return this._bookings.asObservable();
  }

  constructor(private authService:AuthService){}

  addBooking(placeId: string, placeTitle: string, placeImage: string,
        fisrtName: string, lastName: string, guestNumber: number,
        dateFrom: Date, dateTo: Date){
    const newBooking = new Booking(
      Math.random.toString(), placeId, this.authService.userId,
      placeTitle, placeImage, fisrtName, lastName, guestNumber, dateFrom, dateTo
    );
    this._bookings.pipe(take(1), tap(bookings => {
      this._bookings.next(bookings.concat(newBooking));
    }))
  }
}
