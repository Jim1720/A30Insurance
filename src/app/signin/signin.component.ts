import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { CustomerService } from '../customer.service'; 
import { TokenService } from '../token.service'; 
import AuthorizationObject from '../AuthorizationObject';

import Cust from '../Cust';
import { AppService }  from '../app.service'

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

   constructor(private router: Router,
               private storageService: StorageService,
               private customerService: CustomerService,
               private tokenService: TokenService,
               private appService: AppService) {} 

  custId = new FormControl('');
  custPassword = new FormControl(''); 
  message: string = ''; 
  goingTo: string = 'update'; 

    
  onSubmit() {  

    var hubScreen = 'hub';

    if(this.editScreen()) { 
       this.readCustomer(this.custId.value, this.custPassword.value, hubScreen );   
    }

  }

  editScreen(): boolean {  

    if(this.custId.value.length === 0) {
      this.message = "Please enter your customer id";
      return false;
    }
    if(this.custPassword.value.length === 0) {
      this.message = "Please enter your password";
      return false;
    }
    return true;
  } 

  readCustomer(custId: string, custPassword: string, destinationScreen: string ) { 

    let result : boolean = false; 
    var closureThis = this;
    debugger;

    this.customerService.readCustomerSignin(custId, custPassword).subscribe(
 
      (authorizationObject: AuthorizationObject) => {
 
        debugger; 
        this.message = ''
        debugger; 
        if(authorizationObject.Status === "Successful") { 
            debugger;

            this.storageService.storeCustomer(authorizationObject.Customer);
            //
            let c:Cust = authorizationObject.Customer; 
            var customerName = c.custFirst.trim() + " " + c.custLast.trim(); 
            //
            this.appService.signAction("signin",customerName);
            var msg = 'Signed in. Information may be updated here.';
            this.appService.setMessage(msg);
            // get token
            debugger; 
            var tokenString = authorizationObject.Token; // data['token']; 
            var tokenObject = JSON.parse(tokenString);
            closureThis.tokenService.setToken(tokenObject); 
            //  
            let whereTo = '/' + destinationScreen;
            this.router.navigate([whereTo]);  
        } 
        else { /* unauthorized report error */
         
             this.message = authorizationObject.Message;
             return;
        
        }

      },
      (Error) => {

        debugger; 
        this.message = "Server may be down or other error contact administrator.";
        console.log("Registration error message is : " + Error.message);

      } 
      
    );
  }

  
 
}
