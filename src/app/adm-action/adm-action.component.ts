import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import CustomerService from '../customer.service';  
import AdminActionData from '../../app/adminActionData';
import AppService from '../app.service';
import { TokenService } from '../token.service';


@Component({
  selector: 'app-adm-action',
  templateUrl: './adm-action.component.html',
  styleUrls: ['./adm-action.component.css']
})
export class AdmActionComponent implements OnInit {

  constructor(private router: Router,
              private appService: AppService,
              private tokenService: TokenService,
              private customerService: CustomerService ) { }

  newPassword: string = '';
  newPassword2: string = '';
  newCustId: string = '';
  newCustId2: string = '';
  curCustId: string = '';
  message: string = ''; 


  ngOnInit() { 

    var notSignedIn = this.appService.adminNotSignedIn(); 
    console.log('adm action signed in: ' + notSignedIn);
    if (notSignedIn == true) { 
        this.router.navigate(['/splash']);   
    }
} 

  clearFields() {

    this.newPassword = '';
    this.newPassword2 = '';
    this.newCustId = '';
    this.newCustId2 = ''; 
    this.curCustId = '';
  }

  onList() { 
    
     
    this.router.navigate(['/custlist']);   
  }

  onResetPassword() {

    if (this.curCustId === '') {
      this.message = "please enter customer id.";
      return;
    }

    if (this.newPassword === '') {
      this.message = 'please enter password';
      return;
    }

    
    if (this.newPassword2.length === 0) {
      this.message = 'be sure to enter confirmation value for password';
      return;
   }

    if (this.newPassword !== this.newPassword2) {
       this.message = 'confirmation value does not match!';
       return;
    } 

    var passValues = new RegExp('^[A-Z0-9a-z]+');
    var result = passValues.test(this.newPassword); 
    if (result === false) {
      this.message = 'bad password - should be alphanumeric.';
      return;
    }
    this.message = 'good password'
 
    this.resetPassword(this.curCustId, this.newPassword);

  }

  resetPassword(curCustId:string, newPassword: string) {

    debugger;
  
    let result : boolean = false; 
    let adminActionData = new AdminActionData();
    adminActionData.custId = curCustId;;
    adminActionData.newPassword = newPassword; 
    adminActionData['_csrf'] = this.tokenService.getToken();

    this.customerService.resetPassword(adminActionData).subscribe(
      (password:any) => {
 
        debugger;
        result = true;  
        this.message = "Success - information updated."; 
        this.clearFields();

      },
      (Error) => {

        debugger;
        this.message = "Could not reset: " + Error.message;  
      } 

    );  
 
  }

  onResetCustId()
  { 
    
    debugger;
    if (this.curCustId === '' || this.newCustId === '' || this.newCustId2 === '') {
        this.message = 'Must enter current customer Id, new customer id, and confirm new cust id.';
        return;
    }
    if ( this.newCustId !== this.newCustId2) {
         this.message = 'new customer id and confirmation id do not match.'
         return;
    }
    if ( this.curCustId  === this.newCustId) {
      this.message = 'current customer id and new customer id can not be the same.';
      return;
    }

    debugger;
    if(this.curCustId.trim() === '') {
        this.message = "customer id blank";
        return;
    }
    if(this.newCustId.trim() === '') {
        this.message = "new customer id blank..";
        return;
    }
    if(this.newCustId2.trim() === '') {
        this.message = "confirm customer id blank.";
        return;
    }


    this.resetCustId(this.curCustId, this.newCustId);

  }

  resetCustId (curCustId: string, newCustId: string) {
    debugger;
  
    let result : boolean = false;

    let adminActionData = new AdminActionData();
    adminActionData.custId = curCustId;
    adminActionData.newCustId = newCustId; 
    adminActionData['_csrf'] = this.tokenService.getToken();

    this.customerService.resetCustomerId(adminActionData).subscribe(
      (newcust:any) => {
        
        debugger; 
        this.message = newcust['message'];
        result = true;  
        this.clearFields();

      },
      (Error) => {

        debugger;
        this.message = "Could not reset: " + Error;  
      } 

    );  
   
 }
 

}
