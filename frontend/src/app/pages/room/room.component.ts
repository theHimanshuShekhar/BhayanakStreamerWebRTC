import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PresenceService } from 'src/app/services/room/presence.service';
import { RoomService } from 'src/app/services/room/room.service';
import { first } from 'rxjs/operators';
import { ConnectionService } from 'src/app/services/connection/connection.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit{

  @ViewChild('localVideo', {static: false}) public localVideo:any;


  iceServers: RTCConfiguration = {
    "iceServers":[
      {"urls":["stun:stun1.l.google.com:19302"],"username":"","credential":""},
      {"urls":["stun:stun2.l.google.com:19302"],"username":"","credential":""},
      {"urls":["stun:stun3.l.google.com:19302"],"username":"","credential":""},
      {"urls":["stun:stun4.l.google.com:19302"],"username":"","credential":""}],
      "iceTransportPolicy":"all",
      "iceCandidatePoolSize":10
    };


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
    private afs: AngularFirestore,
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
      this.listenForRequests()
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

  listenForRequests() {
    this.afs.collection("rooms/" + this.roomData.roomid + "/offers", ref => ref.where("to","==",this.currentUser.uid).where("type","==","view"))
    .snapshotChanges()
    .subscribe(snapshots =>
      snapshots.forEach(async request => {

        const offerDoc = this.afs.doc(request.payload.doc.ref.path)

        // Create peer connection and add the captured stream tracks to the connection
        const pc = new RTCPeerConnection(this.iceServers)
        this.captureStream.getTracks().forEach((track: MediaStreamTrack) => pc.addTrack(track, this.captureStream))

        // Attach listeners to the peer connection
        pc.onicecandidate = e => {
          console.log("ICE candidate found")
          e.candidate && offerDoc.collection('offerCandidates').add(e.candidate.toJSON());
        };

        pc.onicegatheringstatechange = e => console.log(e);
        pc.onsignalingstatechange = e => console.log(e);
        pc.oniceconnectionstatechange = e => console.log(e);
        pc.onconnectionstatechange = e => console.log(e);
        pc.onnegotiationneeded = e => console.log(e);

        // Create offer from streamer
        const offerDescription = await pc.createOffer()
        await pc.setLocalDescription(offerDescription)

        const offer = {
          sdp: pc.localDescription?.sdp,
          type: pc.localDescription?.type
        }

        offerDoc.set(offer)

        // Listen for answer sdp from viewer
        offerDoc.valueChanges()
        .subscribe(async (doc:any) => {
          if(doc && doc.type === "answer") {
            // Set recieved remote description to peer connection
            await pc.setRemoteDescription(doc);
          }

        });

        // Listen for ice candidates froms viewer and add to peer connection
        offerDoc.collection('answerCandidates').valueChanges()
          .subscribe(candidates => candidates.forEach(candidate => pc.addIceCandidate(new RTCIceCandidate(candidate))));

      })
    )
  }

}
