//
// storage service
//

import { Injectable } from '@angular/core';  
import Cust from './Cust'; 


@Injectable({
    providedIn: 'root'
  })
  
  export class StorageService  {  

    appCust: Cust; 

    public storeCustomer(cust: Cust) {

        debugger;
        this.appCust = cust;
    }

    public fetchCustomer(): Cust {

        return  this.appCust;

    }

    public fetchCustomerId() : string {

        debugger; 
        return this.appCust.custId; 
    }

    public fetchNames():  string { 

        return this.appCust.custFirst + ' '  + this.appCust.custLast;
    }

    public clearCustomer(): void {

        this.appCust = null;
    } 

    public getPlanName(): string {

        return this.appCust.custPlan;
    }

  };