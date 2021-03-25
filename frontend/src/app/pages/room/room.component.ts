import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PresenceService } from 'src/app/services/room/presence.service';
import { RoomService } from 'src/app/services/room/room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  @ViewChild('localVideo', {static: false}) public localVideo:any;

  roomData: any | undefined;
  joinedusers: any[] | undefined;
  captureStream: any;

  constructor(
    private presence: PresenceService,
    private router: Router,
    private route: ActivatedRoute,
    private roomService: RoomService) {}

  ngOnInit(): void {
    const roomid = this.route.snapshot.paramMap.get('roomid');
    if (roomid) {
      this.presence.joinedRoom(roomid);
      this.roomService.getRoomByID(roomid).subscribe(room => this.roomData = room);
      this.roomService.getRoomUsers(roomid).subscribe(users => this.joinedusers = users);
    }
  }

  leaveRoom() {
    this.presence.leftRoom();
    // Remove from firestore then route to rooms page
    this.router.navigate(['rooms']);
  }

  async startCapture() {
    this.captureStream = null;
    try {
      // @ts-ignore
      this.captureStream = await window.navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      this.localVideo.nativeElement.srcObject = this.captureStream;

    } catch(err) {
      console.error("Error: " + err);
    }
  }

}
