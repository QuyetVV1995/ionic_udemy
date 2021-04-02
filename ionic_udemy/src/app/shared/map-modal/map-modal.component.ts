import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  ngAfterViewInit(){
    this.getGoogleMaps().then().catch(err => {
      console.log(err);
    });
  }

  onCancel(){
    this.modalCtrl.dismiss();
  }

  private getGoogleMaps(): Promise<any>{
    const win = window as any;
    const googleModule =  win.google;
    if(googleModule && googleModule.maps){
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script =  document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDtA_NVHjrtTvuby-xuHelM0bGmkGCMsew';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadGoogleModule = win.google;
        if(loadGoogleModule && loadGoogleModule.maps){
          resolve(loadGoogleModule);
        }else{
          reject('Google maps SDK not available');
        }
      };
    });
  }

}
