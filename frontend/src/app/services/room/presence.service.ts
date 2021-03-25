import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import firebase from 'firebase/app';
import 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  constructor(private auth: AngularFireAuth) {  }

  joinedRoom(roomid: string) {
    this.auth.currentUser.then(currentUser => {
      if (currentUser) {
        // Fetch the current user's ID from Firebase Authentication.
        this.stateManagement(currentUser.uid, roomid);
      }
    })
  }

  stateManagement(uid: string, roomid: string) {
    // Create a reference to this user's specific status node.
    // This is where we will store data about being online/offline.
    var userStatusDatabaseRef = firebase.database().ref('/status/' + uid);

    // We'll create two constants which we will write to
    // the Realtime database when this device is offline
    // or online.
    var isOfflineForDatabase = {
        state: 'offline',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    var isOnlineForDatabase = {
        uid: uid,
        state: 'joined',
        roomid: roomid,
        last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    // Create a reference to the special '.info/connected' path in
    // Realtime Database. This path returns `true` when connected
    // and `false` when disconnected.
    firebase.database().ref('.info/connected').on('value', (snapshot) => {
          // If we're not currently connected, don't do anything.
          if (snapshot.val() == false) {
              return;
          };

          // If we are currently connected, then use the 'onDisconnect()'
          // method to add a set which will only trigger once this
          // client has disconnected by closing the app,
          // losing internet, or any other means.
          userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(() => {
              // The promise returned from .onDisconnect().set() will
              // resolve as soon as the server acknowledges the onDisconnect()
              // request, NOT once we've actually disconnected:
              // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

              // We can now safely set ourselves as 'online' knowing that the
              // server will mark us as offline once we lose connection.
              userStatusDatabaseRef.set(isOnlineForDatabase);
            });
        });
  }

  leftRoom() {
    console.log('left the room');
    this.auth.currentUser.then(currentUser => {
      if (currentUser) {
        // Fetch the current user's ID from Firebase Authentication.
        var userStatusDatabaseRef = firebase.database().ref('/status/' + currentUser.uid);
        var isOfflineForDatabase = {
          state: 'offline',
          last_changed: firebase.database.ServerValue.TIMESTAMP,
        };
        userStatusDatabaseRef.set(isOfflineForDatabase)
      }
    })
  }

}
