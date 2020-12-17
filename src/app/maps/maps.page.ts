import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/users.service';

declare var google: any;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {
  map: any;
  infoWindow: any = new google.maps.InfoWindow();
  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;
  getLoc: any;
  userId: string;

  constructor(
    private db: AngularFireDatabase,
    private authSrv: AuthService,
    private userSrv: UserService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.authSrv.userDetails().subscribe(res => {
      if(res != null){
        this.userId = res.uid;
      }
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const posUser = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log(posUser.lat, posUser.lng, this.userId);
          this.userSrv.upLatLng(posUser.lat, posUser.lng, this.userId);
          const location = new google.maps.LatLng(posUser.lat, posUser.lng);
          const options = {
            center: location,
            zoom: 13,
            disableDefaultUI: true
          };
  
          this.map = new google.maps.Map(this.mapRef.nativeElement, options);
          console.log(posUser);
          this.map.setCenter(posUser);
  
          const marker = new google.maps.Marker({
            position: posUser,
            map: this.map,
          });
        });
      }
    });
  }

  showCurrentLocation(){
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log(pos);
        this.map.setCenter(pos);
      });
    }
  }

}
