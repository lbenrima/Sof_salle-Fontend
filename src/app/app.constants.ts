/**
 * Created by m.drissi on 14/07/2017.
 */

import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    //
	public Server: string = 'http://localhost:8000/';
    //public Server: string = 'http://10.241.109.230:8000/';
    public ApiUrl: string = 'v1'; 
    public ServerWithApiUrl = this.Server + this.ApiUrl;
}