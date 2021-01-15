 
 import { Injectable} from '@angular/core'; 
 import { HttpClient, HttpHeaders } from '@angular/common/http'
 import { Observable } from 'rxjs'; 
 import   { AppService }    from './app.service';
 import { TokenService } from './token.service'; 
 import ServiceInfo from './ServiceInfo';
 
 const httpOptions = {
   headers: new HttpHeaders({ 'content-Type': 'application/json' })  
 };
 
 @Injectable({
 providedIn: 'root'
 })
 
 export class ServiceService {  
  
    port: string = this.appService.getApiUrl();  
    token: string = this.tokenService.getToken();  


    constructor(private http:HttpClient,
                private tokenService:TokenService,
                private appService:AppService) {}  
 
 
    
   
    public  makeServicesAvailable(): Observable<ServiceInfo[]> { 
           var readServices = 'readServices';
           const url: string = this.port + readServices;
           return this.http.get<ServiceInfo[]>(url, httpOptions);  
    }

    

    
}

export default ServiceService;
