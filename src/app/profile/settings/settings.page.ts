import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/users.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  userEmail: string;
  userID: string;

  user: any;

  profile: Observable<any>;

  imgSrc: string;
  selectedImage: any = null;
  imgDB: string;
  imgUrl: string;
  boolImg: number;

  @ViewChild('f', null) f: NgForm;


  constructor(
    private storage: AngularFireStorage,
    private navCtrl: NavController,
    private authSrv: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.boolImg = 0;
    this.authSrv.userDetails().subscribe(res => {
      console.log(res);
      console.log('uid: ', res.uid);
      if(res !== null){
        this.userEmail =  res.email;
        this.userID = res.uid;
        this.userService.getUser(this.userID).subscribe(profile => {
          this.user = profile;
          this.imgSrc =  this.user.foto;
          console.log(this.imgSrc);
        });

        setTimeout( () => {
          this.f.setValue(this.user);
        })
      }
      else {
        this.navCtrl.navigateBack('/login');
      }
    }, err => {
      console.log(err);
    });
  }

  onSubmit(form: NgForm){
    console.log(form);

    if(this.boolImg == 1) {
      var filePath = 'user/foto/'+ this.userID;
    
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.imgUrl = url;
            })
        })
      ).subscribe();
    } else {
      this.imgUrl = this.imgSrc;
    }
    form.value['foto'] = this.imgUrl;

    this.userService.update(this.userID, form.value).then(res => {
      this.router.navigateByUrl('/main/profile');
    }).catch(error => console.log(error));

    form.reset();
    this.router.navigateByUrl('/main/profile');
  }

  changeListener(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    }
    else {
      this.imgSrc = this.imgDB;
      this.selectedImage = null;
    }
    this.boolImg = 1;
  }

  logout() {
    this.authSrv.logoutUser()
      .then(res=> {
        console.log(res);
        this.navCtrl.navigateBack('/login');
      })
      .catch(error => {
        console.log(error);
      });
  }

}
