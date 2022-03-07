import { Route, RouterModule } from '@angular/router';
// import { DashboardComponent } from './dashboard.component';

import { WizardComponent } from './forms/wizard/wizard.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarRoomComponent } from './calendar/calendarRoom.component';
import { GroupComponent } from './group/new-group.component';
import { GroupListComponent } from './group/group-list.component';
import {ReservationListComponent} from "./forms/wizard/reservation-list.component";
import {ListRoomComponent} from "./room/listerooms/list-room.component";
import {AddRoomComponent} from "./room/addroom/addRoom.component";
import {AuthGard} from "../auth.guard";

//
export const MODULE_ROUTES: Route[] =[
    { path: '', redirectTo: 'calendar', pathMatch: 'full' },
    { path: 'calendar', component: CalendarComponent , canActivate: [AuthGard]},
    { path: 'calendar/room', component: CalendarRoomComponent , canActivate: [AuthGard]},
    { path: 'forms/wizard', component: WizardComponent, canActivate: [AuthGard]},
    { path: 'group/new-group', component: GroupComponent, canActivate: [AuthGard]},
    { path: 'group/group-list', component: GroupListComponent, canActivate: [AuthGard]},
    { path: 'forms/wizard/reservation-list', component: ReservationListComponent, canActivate: [AuthGard]},
    { path: 'room/listerooms/list-room.component', component: ListRoomComponent, canActivate: [AuthGard]},
    { path: 'room/addroom/addRoom.component', component: AddRoomComponent, canActivate: [AuthGard]}
]
//
export const MODULE_COMPONENTS = [
    CalendarComponent,
	CalendarRoomComponent,
    WizardComponent,
    GroupComponent,
    GroupListComponent,
    ReservationListComponent,
    ListRoomComponent,
    AddRoomComponent,
]
