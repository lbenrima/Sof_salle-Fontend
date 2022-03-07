
/**
 * Created by m.drissi on 30/08/2017.
 */

import {Reservation} from "./reservation";
import {User} from "../../user/user";
import {WeeklyRes} from "./weeklyRes";
import {Collab} from "../../user/collab";
import {Group} from "../../group/group.model";

export class NewReservation {
    reservation:Reservation;
    user:User;
    weeklyRes:WeeklyRes;
    collabs: Collab[];
    collabsObli: Collab[];
    grps:Group;
    mails:string;
}