import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  place: Place;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/discover');

        return;
      }
      this.place = this.placesService.getPlace(paramMap.get('placeId'));
      console.log(this.place);
    });
  }

  onBookPlaces(){

    // this.router.navigateByUrl('/places/discover');
    // this.navCtrl.navigateBack('/places/discover');
    // this.navCtrl.pop();
    this.modalCtrl.create({ component: CreateBookingComponent,
      componentProps: {selectedPlace: this.place},

    })
    .then(modelEl => {
      modelEl.present();
      return modelEl.onDidDismiss();
    })
    .then(resultData => {
      console.log(resultData.data, resultData.role);
      if(resultData.role === 'confirm'){
        console.log('BOOKED!');
      }
    });
  }

}
