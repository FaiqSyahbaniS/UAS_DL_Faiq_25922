import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/services/users.service';
import { FriendsService } from 'src/app/services/friends.service';


@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  userId: string;
  length: number;
  user: any;
  tabUserEmail: any;
  tabFriendEmail: any;
  tmpFriend: any;
  friendList = [];
  cekFriend: boolean = false;
  allUser: any

  constructor(
    private router: Router,
    private authSrv: AuthService,
    private userService: UserService,
    private friendService: FriendsService
  ) { }

  ngOnInit() {
    this.authSrv.userDetails().subscribe(res => {
      if(res !== null){
        this.userId = res.uid;
        this.userService.getUser(this.userId).subscribe(profile => {
          this.user = profile;
        });
      }
    });


  }

  onSubmit(f: NgForm){
    this.userService.getUser(this.userId).subscribe(profile => {
      this.tabUserEmail = profile;
      console.log(this.tabUserEmail.email, f.value.email);
      if(this.tabUserEmail.email == f.value.email){
        console.log('tidak bisa');
      } 
      else {
        this.friendService.getAllFriend(this.userId).snapshotChanges().pipe(
          map(changes => 
            changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
            )
        ).subscribe(data => {
          this.tmpFriend = data;
          console.log(this.tmpFriend);
          if(this.tmpFriend.length == 0){
            console.log(f.value.email, this.userId, this.tmpFriend.length);
            this.friendService.newFriend(f.value.email, this.userId, this.tmpFriend.length).then(res => {
              console.log(res);
              this.router.navigateByUrl('main/friends');
            }).catch(error => console.log(error));
          }
          if (this.tmpFriend.length > 0){
            this.friendService.getAllFriend(this.userId).snapshotChanges().pipe(
              map(changes =>
                changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
                )
            ).subscribe(data => {
              this.tabFriendEmail = data;
              console.log(this.tabFriendEmail);
              for(let i = 0; i < this.tabFriendEmail.length;){
                if(this.tabFriendEmail[i].email == f.value.email){
                  this.cekFriend = false;
                  console.log('teman sudah di tambahkan');
                  break;
                } else {
                  this.cekFriend = true;
                  i++;
                }
              }
              if(this.cekFriend == true){
                this.friendService.newFriend(f.value.email, this.userId, this.tmpFriend.length).then(res => {
                  console.log(res);
                  this.router.navigateByUrl('main/friends');
                }).catch(error => console.log(error));
              }
            })
          }
        });
      }
      });
  }
}
