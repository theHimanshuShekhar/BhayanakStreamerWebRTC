import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';
import { RoomComponent } from './pages/room/room.component';

const routes: Routes = [
  { path: '', component: LandingComponent},
  {path: 'rooms', component: HomeComponent},
  {path: 'room/:id', component: RoomComponent},
  { path: '**', redirectTo: "/"  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
