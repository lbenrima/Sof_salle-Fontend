import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { CalendarComponent } from './dashboard/calendar/calendar.component';
import { CalendarRoomComponent } from './dashboard/calendar/calendarRoom.component';
import { ListRoomComponent } from "./dashboard/room/listerooms/list-room.component";
import { AddRoomComponent } from "./dashboard/room/addroom/addRoom.component";
import { AuthGard } from "./auth.guard";
import { Login } from "./login/login.component";
import { Report } from "./report/report.component";

export const routes: Routes = [
    { path: '', redirectTo: 'calendar', pathMatch: 'full' },
	{ path: 'calendar', component: CalendarComponent , canActivate: [AuthGard]},
	{ path: 'calendar/room', component: CalendarRoomComponent , canActivate: [AuthGard]},
    { path: 'room/listroom', component: ListRoomComponent, canActivate: [AuthGard]},
    { path: 'room/addroom', component: AddRoomComponent, canActivate: [AuthGard]},
	{ path : 'login', component : Login },
	{ path : 'report', component : Report }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

