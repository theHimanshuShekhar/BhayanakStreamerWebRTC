import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PresenceService } from 'src/app/services/room/presence.service';
import { RoomService } from 'src/app/services/room/room.service';
import { first } from 'rxjs/operators';
import { ConnectionService } from 'src/app/services/connection/connection.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit{

  @ViewChild('localVideo', {static: false}) public localVideo:any;

  roomData: any | undefined;
  joinedusers: any[] | undefined;
  captureStream!: any;
  currentUser!: any;

  connections: RTCPeerConnection[] = [];


  constructor(
    private presence: PresenceService,
    private router: Router,
    private route: ActivatedRoute,
    private roomService: RoomService,
    private auth: AuthService,
    private connection: ConnectionService) {}


  ngOnInit(): void {
    const roomid = this.route.snapshot.paramMap.get('roomid');
    if (roomid) {
      this.presence.joinedRoom(roomid);
      this.roomService.getRoomByID(roomid).subscribe(room => this.roomData = room);
      this.roomService.getRoomUsers(roomid).subscribe(users => this.joinedusers = users);
      this.getCurrentUser();
    }
  }

  async getCurrentUser() {
    this.currentUser = await this.auth.getAuthState().pipe(first()).toPromise();
  }


  leaveRoom() {
    this.presence.leftRoom();
    this.stopCapture();
    // Remove from firestore then route to rooms page
    this.router.navigate(['rooms']);
  }

  buttonClick() {
    if (!this.captureStream) this.startCapture();
    else this.stopCapture();
  }

  async startCapture() {

    const mediaOptions: MediaStreamConstraints = {
      video: true,
      audio: {
        echoCancellation: false,
        autoGainControl: false,
        noiseSuppression: false,
      }
    }
    try {
      // @ts-ignore
      this.captureStream = await window.navigator.mediaDevices.getDisplayMedia(mediaOptions);
      this.captureStream.addEventListener("inactive", this.stopCapture.bind(this));
      this.listenForOffers()
      this.presence.startedStreaming(this.currentUser.uid)
    } catch(err) {
      console.error("Error: " + err);
    }
  }

  stopCapture() {
    if(this.captureStream) this.captureStream.getTracks().forEach((track: any) => track.stop());
    this.captureStream = null;

    this.presence.stoppedStreaming(this.currentUser.uid)
  }

  listenForOffers() {
    this.connection.listenForConnections(this.currentUser.uid, this.roomData.roomid)
    .subscribe(offerDocuments => {
      offerDocuments.forEach(async (offer: any) => {
        if (offer) {
          const conn = await this.connection.answerConnections(offer.payload.doc.data().from, this.currentUser.uid, this.roomData.roomid, offer)

          this.captureStream.getTracks().forEach((track: MediaStreamTrack) => {
            conn.addTrack(track, this.captureStream)
          });

          this.connections.push(conn)
          console.log(this.connections)
        }
      });
    });
  }

}
