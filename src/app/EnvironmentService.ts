import { Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import Environment from './Environment';  
import {AppService} from './app.service'; 

const httpOptions = {
    headers: new HttpHeaders({ 'content-Type': 'application/json', 'response-type': 'text' })  
};

@Injectable({
  providedIn: 'root'
}) 

export class EnvironmentService {  
 
    debugger;
    port: string = this.as.getApiUrl(); 
    action:string = 'readenvironment'; 

    constructor(private http:HttpClient,
                private as:AppService) { };   
    
    public getEnvironment(): Observable<Environment> {  
           const url: string = this.port + this.action; 
           return this.http.get<Environment>(url, httpOptions);   
    }

    
}

export default EnvironmentService;