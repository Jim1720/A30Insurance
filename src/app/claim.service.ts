import { Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import Claim from './Claim';
import AdjustedClaimData from './adjustmentClaimData';
import AdjustmentClaimData from './adjustmentClaimData'; 
import   { AppService }    from './app.service';
import ClaimStatusObject from './ClaimStatusObject';

const httpOptions = {
    headers: new HttpHeaders({ 'content-Type': 'application/json' })  
};

@Injectable({
  providedIn: 'root'
})
 

export class ClaimService {  

    debugger;
    port: string = this.as.getApiUrl();

    constructor(private http:HttpClient,
                private as:AppService) { }  
    
    public addClaim(claim: Claim): Observable<Claim> { 
        var url: string = this.port + 'addClaim';  
        var jcust = JSON.stringify(claim); 
        return this.http.post<Claim>(url, jcust, httpOptions) 
    } 

    public readClaimHistory(CustomerID: string): Observable<[Claim]> { 
        debugger; 
        var url: string = this.port + 'history?id=' + CustomerID;
        return this.http.get<[Claim]>(url, httpOptions);  
    } 
    
    public readClaim(ClaimIdNumber: string): Observable<Claim> { 
        var url: string = this.port + 'claim?id=' + ClaimIdNumber;
        return this.http.get<Claim>(url, httpOptions);  
    }  

     // stamp claim
     public stampClaim(input: AdjustmentClaimData) : Observable<AdjustedClaimData> {  
        var url: string = this.port + 'stampAdjustedClaim'; 
        var jcust = JSON.stringify(input); 
        return this.http.put<AdjustedClaimData>(url, jcust, httpOptions);
    }

     // pay claim
     public payClaim(cso : ClaimStatusObject) : Observable<ClaimStatusObject> {  
        var url: string = this.port + 'setClaimStatus'; 
        var jcso = JSON.stringify(cso); 
        return this.http.put<ClaimStatusObject>(url, jcso , httpOptions);
    }
 
}