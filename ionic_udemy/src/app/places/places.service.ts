import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';
import { take, map, tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>([
    new Place('p1',
    'Manhattan Mansion',
    'in the heart of New York City','https://i.pinimg.com/originals/a3/f7/36/a3f7362fce7e50c975c42912806c93e3.jpg',
    149.99,
    new Date('2021-01-01'),
    new Date('2021-12-31'),
    'abc'
    ),
    new Place('p2',
    'Amour Toujours',
    'A romantic place in Paris','https://www.kkhotels.com/wp-content/uploads/2020/01/Paris-City-Eiffeltower-View.jpg',
    189.99,
    new Date('2021-01-01'),
    new Date('2021-12-31'),
    'abc'
    ),
    new Place('p3',
    'The Foggy Palace',
    'Not your average city trip','https://d3mvlb3hz2g78.cloudfront.net/wp-content/uploads/2011/08/thumb_720_450_fog_shutterstock_78589198.jpg',
    99.99,
    new Date('2021-01-01'),
    new Date('2021-12-31'),
    'abc'
     )
  ]) ;

  get places() {
    return this._places.asObservable();
  }


  constructor(private authService: AuthService) { }

  getPlace(id: string){
    return this.places.pipe(take(1), map(places => {
      return {...places.find(
        p => p.id === id
      )};
    } ));
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date ){
    const newPlace = new Place(Math.random.toString(), title, description,
    'https://www.kkhotels.com/wp-content/uploads/2020/01/Paris-City-Eiffeltower-View.jpg',
    price, dateFrom, dateTo,
    this.authService.userId);

    this.places.pipe(take(1)).subscribe(places => {
      this._places.next(places.concat(newPlace));
    });
  }

  updatePlace(placeId: string, title: string, description: string){
    return this.places.pipe(take(1),
     delay(1000),
     tap(places => {
      const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
      const udpatePlaces = [...places];
      const oldPlace = udpatePlaces[updatedPlaceIndex];
      udpatePlaces[updatedPlaceIndex] = new Place(oldPlace.id, title, description,
                        oldPlace.imageUrl,
                        oldPlace.price,
                        oldPlace.availableFrom,
                        oldPlace.availableTo,
                        oldPlace.userId );
      this._places.next(udpatePlaces);
    }))
  }
}
