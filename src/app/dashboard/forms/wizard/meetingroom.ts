/**
 * Created by m.drissi on 23/07/2017.
 */

import {Floor} from "./Floor"
import {Block} from "./Block"
import {Building} from "./Building"

export  class  MeetingRoom {

    idmeetingroom : number;
    name: string;
    capacity : number;
    length : number;
    width : number;
    shape : string;
    idblock : Block ;
    idbuilding : Building ;
    idfloor : Floor;
    description : string;
}