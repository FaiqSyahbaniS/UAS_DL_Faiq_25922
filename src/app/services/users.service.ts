import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { User } from './users.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private dbPath = '/user';
  userRef: AngularFireList<User> = null;

  constructor(
    private db: AngularFireDatabase
  ) { 
    this.userRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<User> {
    return this.userRef;
  }

  getUser(userid: string){
    return this.db.object('user/' + userid).valueChanges();
  }

  create(user: User): any{
    return this.userRef.push(user);
  }

  update(userid: string, value:string): Promise<void> {
    return this.userRef.update(userid, {foto: value});
  }

  upLatLng(lat: number, lng: number, userId: string){
    this.userRef = this.db.list('/user');
    return this.userRef.update(userId, {
      lat: lat,
      lng: lng
    });
  }

  getAllUser(){
    return this.userRef;
  }

}
