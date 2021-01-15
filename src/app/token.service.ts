
//
// token service
//
 
// registration, signin, admin signin call here to store token for
// later use by other activities.

import { Injectable } from '@angular/core';  
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';

import   { AppService }    from './app.service';

import Token from './Token';

var httpOptions = {
    headers: new HttpHeaders({ 'content-Type': 'application/json' })  
};

@Injectable({
  providedIn: 'root'
}) 
 
  
  export class TokenService  {   

    token = {};

    port = this.appService.getApiUrl();
    action = 'gettoken';
    csrf = 'XSRF-TOKEN';

    constructor(private http:HttpClient,
                private appService: AppService) {}
     
    
    public getToken() : any {

      return this.token;
    } 

    public setToken(token:any) {

        debugger;
        var a45object = token['A45Object'];
        var tok = a45object['token']; 
        this.token = tok;

    }
 
  
    
  };