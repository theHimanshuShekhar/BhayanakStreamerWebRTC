import { AfterViewChecked, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, AfterViewChecked {
  @ViewChild('localVideo', {static: false}) public localVideo:any;

  @Input() uid!: string ;
  @Input() captureStream!: MediaStream;
  @Input() isMuted!: boolean;
  @Input() isStreaming?: boolean;
  @Input() currentUID?: string ;
  @Input() roomID?: string;

  iceServers: RTCConfiguration = {
    "iceServers":[
      {"urls":["turn:65.1.37.89:3478"],"username":"<USERNAME>","credential":"<PASSWORD>"},
      {"urls":["turn:192.158.29.39:3478?transport=tcp"],"username":"28224511:1379330808","credential":"JZEOEt2V3Qb0y27GRntt2u2PAYA="},
      {"urls":["turn:192.158.29.39:3478?transport=udp"],"username":"28224511:1379330808","credential":"JZEOEt2V3Qb0y27GRntt2u2PAYA="},
      {"urls":["turn:numb.viagenie.ca"],"username":"gotismurf@gmail.com","credential":"golusing95"},
      {"urls":["stun:stun1.l.google.com:19302"],"username":"","credential":""},
      {"urls":["stun:stun2.l.google.com:19302"],"username":"","credential":""},
      {"urls":["stun:stun3.l.google.com:19302"],"username":"","credential":""},
      {"urls":["stun:stun4.l.google.com:19302"],"username":"","credential":""}],
      "iceTransportPolicy":"all",
      "iceCandidatePoolSize":10
    };

  user: any;

  constructor(private auth: AuthService, private afs: AngularFirestore) {
  }

  ngOnInit(): void {
    if(this.uid) {
      this.auth.getUserWithUID(this.uid).subscribe(user => {
        this.user = user;
      })
    }
  }

  ngAfterViewChecked() {
    if(this.localVideo && this.captureStream) this.localVideo.nativeElement.srcObject = this.captureStream;
  }

  async joinStream() {
    if(this.currentUID && this.roomID) {

      // Add request to establish connection with streamer
      const offerDoc = this.afs.collection("rooms/" + this.roomID + "/offers").doc()
      const offerpayload = {
        from: this.currentUID,
        to: this.uid,
        type: 'view'
      }
      await offerDoc.set(offerpayload)

      const pc = new RTCPeerConnection(this.iceServers)

      // Attach listeners to the peer connection
      pc.ontrack = event => {
        this.captureStream = new MediaStream();
        // Get video and audio tracks from peer connection and add to media stream
        event.streams[0].getTracks().forEach(track => {
            this.captureStream.addTrack(track);
        });
      };

      pc.onicegatheringstatechange = e => console.log(e);
      pc.onsignalingstatechange = e => console.log(e);
      pc.oniceconnectionstatechange = e => console.log(e);
      pc.onconnectionstatechange = e => console.log(e);
      pc.onnegotiationneeded = e => console.log(e);

      pc.onicecandidate = e => {
        console.log("ICE candidate found")
        e.candidate && offerDoc.collection('answerCandidates').add(e.candidate.toJSON());
      };

      // Listen for offer from streamer
      offerDoc.valueChanges()
      .subscribe(async (offer:any) => {
        if(offer && offer.type === "offer") {
          // Set recieved remote description to peer connection
          await pc.setRemoteDescription(offer)
          const answerDescription = await pc.createAnswer();
          await pc.setLocalDescription(answerDescription)

          const answerpayload = {
            sdp: pc.localDescription?.sdp,
            type: pc.localDescription?.type,
          }

          console.log(answerpayload)
          // Send local description to database for streamer
          await offerDoc.set(answerpayload)
          console.log('after')

          // Listen for ice candidates from streamer and add to peer connection
          offerDoc.collection('offerCandidates').valueChanges()
          .subscribe(candidates => candidates.forEach(candidate => pc.addIceCandidate(new RTCIceCandidate(candidate))));
        }
      })

    }
  }
}
