import { Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import Cust from './Cust';
import AdminActionData from './adminActionData'; 
import   { AppService }    from './app.service';
import { TokenService } from './token.service';
import AuthorizationObject from './AuthorizationObject';
import PlanParm from './PlanParm';
import PlanInfo from './PlanInfo';

const httpOptions = {
  headers: new HttpHeaders({ 'content-Type': 'application/json' })  
};

@Injectable({
providedIn: 'root'
})

export class CustomerService {  
 
    port: string = this.as.getApiUrl();  
    token: string = this.tokenService.getToken(); 

    constructor(private http:HttpClient,
                private tokenService:TokenService,
                private as:AppService) {} 
   
    public readCustomer(CustomerID: string): Observable<AuthorizationObject> { 
           const url: string = this.port + 'cust?id=' + CustomerID;
           return this.http.get<AuthorizationObject>(url, httpOptions);  
    }

    // Read and authoirize customer
    public readCustomerSignin(CustomerID: string, customerPassword: string): Observable<AuthorizationObject> { 
      const url: string = this.port + 'signin?id=' + CustomerID + '&pw=' + customerPassword;
      return this.http.get<AuthorizationObject>(url, httpOptions);  
}

    // Register Customer
    public registerCustomer(cust: Cust): Observable<AuthorizationObject> {  
      var url: string = this.port + 'register';  
      var jcust = JSON.stringify(cust); 
      return this.http.post<AuthorizationObject>(url, jcust, httpOptions)
     } 

    // Update Customer
    public updateCustomer(cust: Cust): Observable<Cust> { 
        cust['XSRF-TOKEN'] = this.token;
        var url: string = this.port + 'update'; 
        var jcust = JSON.stringify(cust); 
        return this.http.put<Cust>(url, jcust, httpOptions);
    }

    public listCustomers(): Observable<Cust[]> { 
      const url: string = this.port + 'custList';
      return this.http.get<Cust[]>(url, httpOptions);  
    }

     // Update Password
     public resetPassword(input:AdminActionData) : Observable<AdminActionData> {  
      var url: string = this.port + 'resetPassword'; 
      var jcust = JSON.stringify(input); 
      return this.http.put<AdminActionData>(url, jcust, httpOptions);
  }

    // Reset Customer Id
    public resetCustomerId(input:AdminActionData) : Observable<AdminActionData> {  
      var url: string = this.port + 'resetCustomerId'; 
      var jcust = JSON.stringify(input); 
      return this.http.put<AdminActionData>(url, jcust, httpOptions);
  }  

   // update Plan 
   public updatePlan(input:PlanParm) : Observable<PlanParm> {  
    var url: string = this.port + 'updatePlan'; 
    var jcust = JSON.stringify(input); 
    return this.http.put<PlanParm>(url, jcust, httpOptions);
}  
  
}

export default CustomerService;
