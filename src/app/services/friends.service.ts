import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Friend } from './friends.model';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  private dbPath ="/friend";
  friendRef: AngularFireList<Friend> = null;
  tmpFriend: any;
  tmp: any;

  constructor(
    private db: AngularFireDatabase
  ) 
  {
    this.friendRef = db.list(this.dbPath);  
  }

  getAll(): AngularFireList<Friend> {
    return this.friendRef;
  }

  getAllFriend(userId: string): AngularFireList<Friend>{
    this.tmpFriend = this.db.list(this.dbPath, ref => ref.child(userId));
    return this.tmpFriend;
  }

  // create(friend: Friend, userID, id): any {
  //   id = id + 1;
  //   this.tmp = "/friend-" + id;
  //   return this.friendRef.update(userID + '/' + this.tmp, {
  //     id: id,
  //     name: friend.name,
  //     image: friend.image
  //   });
  // }

  delete(id: string, userID): Promise <void> {
    this.tmp = "/friend-" + id;
    return this.friendRef.remove(userID + '/' + this.tmp);
  }

  newFriend(friendEmail: string, userId: string, count: number): any {
    count = count + 1;
    this.tmp = '/friend-' + count;
    return this.friendRef.update(userId + '/' + this.tmp, {
      email: friendEmail
    });
  }

  deleteFriend(userId: string, friendId: string): Promise <void> {
    return this.friendRef.remove(userId + '/' + friendId);
  }
}
