 
import { Injectable, EventEmitter, Output } from '@angular/core';  
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

  _historyStay : boolean = false;
  _historyFocus : boolean = false;

  _focusedClaim: string = "";
  _focusedType : string = "";
 
  activity = { ClaimId: '', Action: '', Time: '' };
  activities: any [] = [];

  setHistoryFocus(value: boolean) {
     this._historyFocus = value;
  }

  getHistoryFocus() : boolean {
     return this._historyFocus;
  }
  


  haveFocusedClaim() : boolean {

    return  (this._focusedClaim !== "" );

  }

  getFocusedClaim() : string   {

     var c = this._focusedClaim;
     if(c === undefined || c === null || c === '')
        return '';

     return this._focusedClaim;
  }

  setFocusedClaim(value : string) {
     this._focusedClaim = value;
  }

  setFocusedType(value : string) {
     this._focusedType = value;
  }

  getFocusedType() {
     return this._focusedType;
  }

  setHistoryStay(value: boolean ) {
     this._historyStay = value;
  }
  getHistoryStay() : boolean {
     return this._historyStay;
  }
 
 
 
 setActivity(ClaimId: string, Action: string) {

   let dateTime = new Date(); 
   let hour = dateTime.getHours();
   let min = dateTime.getMinutes(); 
   let _time = "${hour} : ${min}";

    // if array is full and has two entries , remove first element
    if(this.activities.length === 2) {
       // remove oldest (first) element since push adds at end
       var removeFirstEntry = 0;
       this.activities.splice(removeFirstEntry, 1);
    }

    // remember an activity for daily recall
    this.activity = { ClaimId: ClaimId , Action: Action, Time: _time };
    this.activities.push(this.activity);

  }  

  getActivty(index: number)  {
     
    // pass 1 or 2.
     var count = this.activities.length;
     if(index > count) return null;
     var entry = index - 1;
     var item = this.activities[entry];
     this.activity = item;
     return this.activity; 

  }

  getActivityCount() : number { 
     
      return this.activities.length; 
  }


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

     //const urlPrefix = environment.urlPrefix; 
   
    // return "http://localhost:3200/";
    
    return "azoure url...";

    //return urlPrefix;

   }

   public usingStay() {
      return this.isTrue(environment.useStay);
   }
   public usingFocus() {
      return this.isTrue(environment.useFocus);
   }
   public usingNav() {
      return this.isTrue(environment.useNav);
   }   
   
   public usingAct() {
      return this.isTrue(environment.useActions);
   }   

   private isTrue(value? : any) {

       if (value === null || value === undefined) {
          return false;
       }
       var isTrue = value;
       return isTrue;
   }
 
}

export default AppService;

