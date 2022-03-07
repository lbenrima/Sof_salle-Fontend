import {User} from "../user/user";
import {Member} from "../group/member.model";
/**
 * Created by m.drissi on 19/07/2017.
 */

export class Group {
    public id: number;
    public number: number;
    public mail: string;
    //public membersList : Member[];
    public iduser : User;
    
}