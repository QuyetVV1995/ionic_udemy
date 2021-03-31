import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places: Place[] = [
    new Place('p1',
    'Manhattan Mansion',
    'in the heart of New York City','https://i.pinimg.com/originals/a3/f7/36/a3f7362fce7e50c975c42912806c93e3.jpg',
    149.99),
    new Place('p2',
    'Amour Toujours',
    'A romantic place in Paris','https://www.kkhotels.com/wp-content/uploads/2020/01/Paris-City-Eiffeltower-View.jpg',
    189.99 ),
    new Place('p3',
    'The Foggy Palace',
    'Not your average city trip','https://d3mvlb3hz2g78.cloudfront.net/wp-content/uploads/2011/08/thumb_720_450_fog_shutterstock_78589198.jpg',
    99.99 ),
  ];

  get places(){
    return [...this._places];
  }
  constructor() { }

  getPlace(id: string){
    return {...this._places.find(
      p => p.id === id
    )};
  }
}
