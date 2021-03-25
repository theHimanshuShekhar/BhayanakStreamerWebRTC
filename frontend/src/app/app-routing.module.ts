import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';
import { RoomComponent } from './pages/room/room.component';
import { LoginAuthGaurd } from './services/routing/logingaurd.service';
import { NonloginGaurd } from './services/routing/nonlogingaurd.service';

const routes: Routes = [
  { path: 'login', component: LandingComponent, canActivate: [LoginAuthGaurd]},
  { path: 'rooms', component: HomeComponent, canActivate: [NonloginGaurd] },
  { path: 'room/:roomid', component: RoomComponent, canActivate: [NonloginGaurd] },
  { path: '**', redirectTo: "/login"  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
