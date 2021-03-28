import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  iceServers: RTCConfiguration = {
    "iceServers":[
      {"urls":["stun:stun1.l.google.com:19302"],"username":"","credential":""},
      {"urls":["stun:stun2.l.google.com:19302"],"username":"","credential":""},
      {"urls":["stun:stun3.l.google.com:19302"],"username":"","credential":""},
      {"urls":["stun:stun4.l.google.com:19302"],"username":"","credential":""}],
      "iceTransportPolicy":"all",
      "iceCandidatePoolSize":10
    };

  constructor(private afs: AngularFirestore) { }

  createRequest(remoteUID: string, currentUID: string, roomID: string) {

  }

  listenForRequests(currentUID: string, roomID: string) {
    return this.afs.collection("rooms/" + roomID + "/offers", ref => ref.where("to","==",currentUID).where("type","==","view")).valueChanges()
  }




  //  async offerConnection(remoteUID: string, currentUID: string, roomID: string) {
  //   // Establish connection with WebRTC and return MediaStream
  //   const offerDoc = this.afs.collection("rooms/" + roomID + "/offers").doc()

  //   // Create local peer connection
  //   const pc = new RTCPeerConnection(this.iceServers)

  //   pc.onicecandidate = e => {
  //     console.log("ICE candidate found")
  //     e.candidate && offerDoc.collection('offerCandidates').add(e.candidate.toJSON());
  //   };

  //   pc.onicegatheringstatechange = e => console.log(e);
  //   pc.onsignalingstatechange = e => console.log(e);
  //   pc.onicecandidateerror = e => console.log(e);
  //   pc.oniceconnectionstatechange = e => console.log(e);
  //   pc.onconnectionstatechange = e => console.log(e);
  //   pc.onnegotiationneeded = e => console.log(e);

  //   const offerDescription = await pc.createOffer()
  //   await pc.setLocalDescription(offerDescription)

  //   console.log("adding offer to db")

  //   const offer = {
  //     sdp: pc.localDescription?.sdp,
  //     type: pc.localDescription?.type,
  //     from: currentUID,
  //     to: remoteUID,
  //   }

  //   // Send offer to remote user through firestore
  //   await offerDoc.set(offer);

  //   // Check for answer in database
  //   offerDoc.valueChanges().subscribe(async (doc:any)=> {
  //     if (doc && !pc.currentRemoteDescription && doc.type === "answer") {
  //       await pc.setRemoteDescription({sdp: doc.sdp, type: doc.type})
  //       await offerDoc.delete()
  //     }
  //   });


  //   console.log(pc)

  //   return pc;
  // }

  // listenForConnections(currentUID: string, roomID: string) {
  //   return this.afs.collection("rooms/" + roomID + "/offers", ref=> ref.where("to","==", currentUID))
  //   .snapshotChanges()
  // }

  // async answerConnections(remoteUID: string, currentUID: string, roomID: string, offer:any) {

  //   console.log("Answer Connection")
  //   const offerDoc = this.afs.doc(offer.payload.doc.ref.path)

  //   const offerData = offer.payload.doc.data()

  //   const rc = new RTCPeerConnection(this.iceServers)

  //   rc.onicecandidate = event => {
  //     console.log("ICE candidate found")
  //     event.candidate && offerDoc.collection('answerCandidates').add(event.candidate.toJSON());
  //   };

  //   rc.onicegatheringstatechange = e => console.log(e);
  //   rc.onsignalingstatechange = e => console.log(e);
  //   rc.onicecandidateerror = e => console.log(e);
  //   rc.oniceconnectionstatechange = e => console.log(e);
  //   rc.onconnectionstatechange = e => console.log(e);
  //   rc.onnegotiationneeded = e => console.log(e);

  //   await rc.setRemoteDescription({sdp: offerData.sdp, type: offerData.type})
  //   const answerDescription = await rc.createAnswer()
  //   await rc.setLocalDescription(answerDescription)
  //   const answer = {
  //     sdp: rc.localDescription?.sdp,
  //     type: rc.localDescription?.type,
  //     from: currentUID,
  //     to: remoteUID,
  //   }
  //   await offerDoc.set(answer)

  //   console.log(rc)

  //   return rc;
  // }
}
