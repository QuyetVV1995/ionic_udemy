import { error } from '@angular/compiler/src/util';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { BookingService } from 'src/app/bookings/booking.service';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {

  place: Place;
  isBookable = false;
  isLoading = false;
  private placeSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/discover');
        return;
      }
      this.isLoading = true;
      this.placeSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(places => {
        this.place = places;
        this.isBookable = places.userId !== this.authService.userId;
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
          header: 'An error ocurred',
          message : 'Cloud not load place',
          buttons: [{text: 'Okay', handler: () => {
            this.router.navigate(['/places/discover']);
          }}]
        }).then(alertEl => {
          alertEl.present();
        });
      }
      );
    });
  }

  onBookPlaces(){

    // this.router.navigateByUrl('/places/discover');
    // this.navCtrl.navigateBack('/places/discover');
    // this.navCtrl.pop();
    this.actionSheetCtrl.create({
      header: 'Choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModal('random');
          }
        },
        {
          text: 'Cancel',
          role: 'destructive'
        }
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });

  }

  openBookingModal(mode: 'select' | 'random'){
    console.log(mode);
    this.modalCtrl
    .create({ component: CreateBookingComponent,
      componentProps: {selectedPlace: this.place, selectedMode: mode}

    })
    .then(modelEl => {
      modelEl.present();
      return modelEl.onDidDismiss();
    })
    .then(resultData => {
      if(resultData.role === 'confirm'){
        this.loadingCtrl.create({message:'Booking place...'})
        .then(loadingEl => {
          loadingEl.present();
          const data = resultData.data.bookingData;
            this.bookingService.addBooking(this.place.id, this.place.title,
            this.place.imageUrl, data.fisrtName,
            data.lastName, data.guestNumber,
            data.startDate, data.endDate).subscribe(() => {
              loadingEl.dismiss();
            });
        });
      }
    });
  }


  ngOnDestroy(){
    if(this.placeSub){
      this.placeSub.unsubscribe();
    }
  }
}
