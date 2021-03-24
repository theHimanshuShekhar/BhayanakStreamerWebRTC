import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { RoomService } from 'src/app/services/room/room.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  roomList: any;

  createForm: FormGroup | any;

  constructor(
    private roomService: RoomService,
    private router: Router) {}

  ngOnInit(): void {
    this.roomService.getRooms().subscribe(rooms => this.roomList = rooms)

    this.createForm = new FormGroup({
      roomname: new FormControl('', Validators.required),
      password: new FormControl(''),
    });
  }

  get roomname() { return this.createForm.get('roomname'); }


  goToRoom(id: string) {
    this.router.navigate(["room", id])
  }

  createRoom() {
    this.roomService.createRoom(this.createForm.value)
  }

}
