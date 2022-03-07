/**
 * Created by m.drissi on 28/07/2017.
 */

import {Group} from  "../group/group.model";
import {Collab} from "../user/collab"
import {User} from "../user/user";

export class GroupCollab {
    public user:User;
    public grp: Group;
    public collabs: Collab[];


}