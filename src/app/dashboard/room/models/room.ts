/**
 * Created by m.drissi on 10/08/2017.
 */

import {Floor} from "./Floor"
import {Block} from "./Block"
import {Building} from "./Building"

export  class  Room {

    idroom : number;
    name: string;
    capacity : number;
    idblock : Block;
    idfloor : Floor;
    idbuilding : Building;
    adresse : string;
    telephone : number;
    videoproj : boolean;
    pontteleph : boolean;
    visio : boolean;
    action:boolean=false;
    color: string;


}
