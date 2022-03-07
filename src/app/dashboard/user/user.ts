/**
 * Created by m.drissi on 19/07/2017.
 */
import { Room } from '../room/models/room';
export class User {
    public id: number;
    public name: string;
    public mail: string;
    public stateuser: boolean;
    rooms : Room[];
}
