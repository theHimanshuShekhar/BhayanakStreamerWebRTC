import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';
import { RoomComponent } from './pages/room/room.component';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';

const routes: Routes = [
  { path: 'login', component: LandingComponent},
  { path: 'rooms', component: HomeComponent, canActivate: [AngularFireAuthGuard] },
  { path: 'room/:roomid', component: RoomComponent, canActivate: [AngularFireAuthGuard] },
  { path: '**', redirectTo: "/login"  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
