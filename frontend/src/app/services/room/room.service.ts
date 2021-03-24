import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private afs: AngularFirestore) { }

  getRooms() {
    return this.afs.collection("rooms").valueChanges({idField: "id"});
  }

  getRoomByID(id:string) {
    return this.afs.collection<AngularFirestoreCollection>("rooms").doc(id).valueChanges();
  }
}
