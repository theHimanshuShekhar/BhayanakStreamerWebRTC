import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase';
import { RoomService } from 'src/app/services/room/room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  roomData: any | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private roomService: RoomService) { }

  ngOnInit(): void {
    const roomid = this.route.snapshot.paramMap.get('roomid');
    if (roomid) {
      this.roomService.getRoomByID(roomid).subscribe(room => this.roomData = room);
    }
  }

  leaveRoom() {
    // Remove from firestore then route to rooms page
    this.router.navigate(['rooms']);
  }

}
