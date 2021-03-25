import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private db: AngularFireDatabase) { }

  getRooms() {
    return this.afs.collection("rooms").valueChanges({idField: "id"});
  }

  getRoomByID(id:string) {
    return this.afs.collection<AngularFirestoreCollection>("rooms").doc(id).valueChanges();
  }

  createRoom(data: {roomname:string; password?: string}) {
    this.auth.getUser().then(currentUser => {
      if (currentUser) {
        console.log('creating room')
        const pushkey = this.afs.createId();
        this.afs.collection("rooms").doc().set({
          roomid: pushkey,
          name: data.roomname,
          password: data.password || null,
          createdOn: new Date(),
          owner: currentUser.uid,
        })
        .then(() => console.log('room created'))
        .catch(err => console.error(err))
      }
    })
  }

  getRoomUsers(rid: string) {
    return this.db.list('/status', ref => ref.orderByChild('roomid').equalTo(rid)).valueChanges()
  }
}
