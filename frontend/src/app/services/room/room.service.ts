import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private afs: AngularFirestore, private auth: AuthService) { }

  getRooms() {
    return this.afs.collection("rooms").valueChanges({idField: "id"});
  }

  getRoomByID(id:string) {
    return this.afs.collection<AngularFirestoreCollection>("rooms").doc(id).valueChanges();
  }

  createRoom(data: {roomname:string; password?: string}) {
    this.auth.getUser().then(currentUser => {
      if (currentUser) this.afs.collection("rooms").doc().set({
        name: data.roomname,
        password: data.password || null,
        createdOn: new Date(),
        owner: currentUser.uid,
      })
    })
  }
}
