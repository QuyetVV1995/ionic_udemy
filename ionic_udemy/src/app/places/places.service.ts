import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


interface PlaceData{
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>([]) ;

  get places() {
    return this._places.asObservable();
  }


  constructor(private authService: AuthService,
    private http: HttpClient) { }

  fetchPlaces(){
    return this.http
    .get<{[key:string]: PlaceData }>('https://ionic-angular-course-c7adb-default-rtdb.firebaseio.com/offered-places.json')
    .pipe(map(resData => {
      const places = [];

      for(const key in resData){
        if( resData.hasOwnProperty(key)){
          places.push(new Place(key,
            resData[key].title,
            resData[key].description,
            resData[key].imageUrl,
            resData[key].price,
            new Date(resData[key].availableFrom),
            new Date(resData[key].availableTo),
            resData[key].userId))
        }
      }
      return places;
    }),
    tap(places => {
      this._places.next(places);
    })
    );
  }


  getPlace(id: string) {
    return this.http
      .get<PlaceData>(
        `https://ionic-angular-course-c7adb-default-rtdb.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        map(placeData => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId
          );
        })
      );
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date ){

    let generatedId: string;
    const newPlace = new Place(Math.random.toString(), title, description,
    'https://www.kkhotels.com/wp-content/uploads/2020/01/Paris-City-Eiffeltower-View.jpg',
    price, dateFrom, dateTo,
    this.authService.userId);

    return this.http
    .post<{name: string}>('https://ionic-angular-course-c7adb-default-rtdb.firebaseio.com/offered-places.json', {...newPlace, id:null })
    .pipe(
      switchMap(resData => {
        generatedId = resData.name;
        return this.places;
      }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    ).subscribe();
    // return this.places.pipe(take(1)).subscribe(places => {
    //   this._places.next(places.concat(newPlace));
    // });
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        return this.http.put(
          `https://ionic-angular-course-c7adb-default-rtdb.firebaseio.com/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }


}
