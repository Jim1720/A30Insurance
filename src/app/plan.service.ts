 
 import { Injectable} from '@angular/core'; 
 import { HttpClient, HttpHeaders } from '@angular/common/http'
 import { Observable } from 'rxjs'; 
 import   { AppService }    from './app.service';
 import { TokenService } from './token.service'; 
 import PlanInfo from './PlanInfo';
 
 const httpOptions = {
   headers: new HttpHeaders({ 'content-Type': 'application/json' })  
 };
 
 @Injectable({
 providedIn: 'root'
 })
 
 export class PlanService {  
  
    port: string = this.as.getApiUrl();  
    token: string = this.tokenService.getToken();  
    constructor(private http:HttpClient,
                private tokenService:TokenService,
                private as:AppService) {} 
              
   
    public readPlans(): Observable<PlanInfo> { 
           var readPlans = 'readPlans';
           const url: string = this.port + readPlans;
           return this.http.get<PlanInfo>(url, httpOptions);  
    }

   
}

export default PlanService;
