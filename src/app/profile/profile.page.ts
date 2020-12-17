import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {

  userId: string;
  user: any;
  imgSrc: string;
  selectedImage: any = null;
  imgDB: string;
  imgUrl: string;


  constructor(
    private storage: AngularFireStorage,
    private authSrv: AuthService,
    private userSrv: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authSrv.userDetails().subscribe(res => {
      console.log(res);
      if(res !== null){
        this.userId = res.uid;
        this.userSrv.getUser(this.userId).subscribe(profile => {
          this.user = profile;
          this.imgSrc = this.user.foto;
          console.log(this.imgSrc);
        });
      } else {
        this.router.navigateByUrl('/login');
      }
    });
  }

  changeListener(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];

      var filePath = 'user/foto/'+ this.userId;
    
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.imgUrl = url;
            })
        })
      ).subscribe();

      this.userSrv.update(this.userId, this.imgUrl).then(res => {
        this.router.navigateByUrl('/main/profile/');
      }).catch(error => console.log(error));
    }
    else {
      this.imgSrc = this.imgDB;
      this.selectedImage = null;
    }
  }

  logout() {
    this.authSrv.logoutUser()
      .then(res=> {
        console.log(res);
        this.router.navigateByUrl('/login');
      })
      .catch(error => {
        console.log(error);
      });
  }

}