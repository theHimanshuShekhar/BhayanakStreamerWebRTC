import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  servers = {
    iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun3.l.google.com:19302',
          'stun:stun4.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  constructor(private afs: AngularFirestore) { }

   async offerConnection(remoteUID: string, currentUID: string, roomID: string) {
    // Establish connection with WebRTC and return MediaStream
    const offerDoc = this.afs.collection("rooms/" + roomID + "/offers").doc()

    // Create local peer connection
    const pc = new RTCPeerConnection(this.servers)

    pc.onicecandidate = e => console.log(e);
    pc.oniceconnectionstatechange = e => console.log(e);
    pc.ontrack = (event) => console.log(event);

    pc.onicecandidate = event => {
      console.log("ICE candidate found")
      event.candidate && offerDoc.collection('offerCandidates').add(event.candidate.toJSON());
    };

    // Create offer payload for database
    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription)

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
      from: currentUID,
      to: remoteUID,
    }
    // Send offer to remote user through firestore
    offerDoc.set(offer);


    // Check for answer in database
    offerDoc.valueChanges().subscribe((doc:any)=> {
      if (doc && !pc.currentRemoteDescription && doc.type === "answer") {
        pc.setRemoteDescription({sdp: doc.sdp, type: doc.type})
        .then(() => {
          // Delete the document
          offerDoc.delete()
        })
      }
    })

    return pc;
  }

  listenForConnections(currentUID: string, roomID: string) {
    return this.afs.collection("rooms/" + roomID + "/offers", ref=> ref.where("to","==", currentUID))
    .snapshotChanges()
  }

  async answerConnections(remoteUID: string, currentUID: string, roomID: string, offer:any) {

    console.log("Answer Connection")
    const offerDoc = this.afs.doc(offer.payload.doc.ref.path)

    const offerData = offer.payload.doc.data()

    const rc = new RTCPeerConnection(this.servers)

    rc.onicecandidate = e => console.log("Got new ICE candidate " + e);
    rc.oniceconnectionstatechange = e => console.log("Connection state changed " + e);

    rc.setRemoteDescription({sdp: offerData.sdp, type: offerData.type})
    const answerDescription = await rc.createAnswer()
    await rc.setLocalDescription(answerDescription)

    const answer = {
      sdp: answerDescription.sdp,
      type: answerDescription.type,
      from: currentUID,
      to: remoteUID,
    }
    offerDoc.set(answer)

    return rc;
  }
}
