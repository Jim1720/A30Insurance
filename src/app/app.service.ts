import { Injectable, EventEmitter, Output } from '@angular/core'; 
import * as Rx from "rxjs"; 
import ColorInfoObject  from '../app/ColorInfoObject';
import SignStatusObject from '../app/SignStatusObject'

//TODO update to jscore3.
 
import { environment } from './../environments/environment';   

@Injectable({
  providedIn: 'root'
}) 
 

export class AppService { 

   @Output() signEvent = new EventEmitter<any>(); 

   promo: string = '';
   noChangesToFormat: string = '100';
   picOrNoneOnly:string  = '200';
   fullColor:string = '300';
   // must be pulled from:
   //  a. register
   //  b. signin   

   // success message from claim and adjustment.
   postedMessage: string = ""; 

  // enforce logged in to goto any screen.
  _isUserSignedIn:boolean = false;
  _isAdminUserSignedIn: boolean = false; 


   signAction(signAction: string, customerName: string ) {

      // called when signing in or out to
      // emit name to appComponent.
      // 'signin' or 'signout' is passed.
      // call from register, signin, or signout.

      debugger; 
      var signStatusObject = new SignStatusObject();
      signStatusObject.signAction = signAction;
      signStatusObject.customerName = customerName; 
      this.signEvent.emit(signStatusObject); 
      // enforce URL routes prevent illegal url usage.
      this._isUserSignedIn = ( signAction == "signin");
      this._isAdminUserSignedIn = false;
   }
 

   notSignedIn() : boolean {

    // insure access to views are valid not by invalid url pattern.
   return ( this._isUserSignedIn == false ); 
  }

  adminNotSignedIn(): boolean {

       // insure access to views are valid not by invalid url pattern.
       return ( this._isAdminUserSignedIn == false ); 
  }

  signInAdmin() {
  
      this._isAdminUserSignedIn = true; 
  }


 
    setMessage(msg:string) {
        debugger; 
        this.postedMessage = msg;
 
    }
    getMessage() : string {
       debugger;
       var show = this.postedMessage; 
       this.postedMessage = '';
       return show;
    }

   editPromo(promoCode: string) {

      return (promoCode === '100' || 
      promoCode === '200' || 
      promoCode === '300');

   }

   setPromo(promoCode:string) {
      this.promo = promoCode;
   }
   getPromo(): string {
     return this.promo;
   } 
 
 

  index: number = 3; // first time defaults to none.
  max: number = 3;   


   public getApiUrl() : string {

    // when moving to production change this:
    // claim service, customer service use this.

    //TODO: recompile for prod

    // return 'azure=prod-link'

    // all local. all test.
 

    // const urlPrefix = environment.urlPrefix; 

    return "https://project20a45serverjsb09142020a1.azurewebsites.net/";
    
   // return "http://localhost:3200/";

    //return urlPrefix;

   }
 
}

export default AppService;

