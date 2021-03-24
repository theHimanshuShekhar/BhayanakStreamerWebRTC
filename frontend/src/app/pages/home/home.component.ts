import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RoomService } from 'src/app/services/room/room.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  roomList: any;

  constructor(
    private authService: AuthService,
    private roomService: RoomService,
    private router: Router) {}

  ngOnInit(): void {
    this.roomService.getRooms().subscribe(rooms => this.roomList = rooms)
  }

  logout() {
    this.authService.logout();
  }

  goToRoom(id: string) {
    this.router.navigate(["room", id])
  }

}
