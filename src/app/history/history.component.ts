import { Component, ElementRef, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { ClaimService } from '../claim.service';
import { StorageService } from '../storage.service'; 
import  Claim  from '../Claim';  
import { AdjustmentService } from '../adjustment.service';  
import { Router } from '@angular/router'; 
import AppService from '../app.service';
import ClaimStatusObject from '../ClaimStatusObject'; 
import { TokenService } from '../token.service'; 
import ClaimInHistory from '../ClaimInHistory';  
  
declare var $ : any;

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit, AfterContentInit {
 
  
  @ViewChild("bot1", { static:false, read: ElementRef} ) bottomButton! : ElementRef<any>; 

  claims: ClaimInHistory[]  =  [];
  customerIdentification: string = ' ';
  message: string = '';
  custNames: string = '';
  displaySequence: string = ' 1 of '; // place holder
  claimCount: string = ''; 
  histMessage: string = '';
  showHistMessage: boolean = false;
  stay : string = (this.appService.getHistoryStay() === true) ? 'stay on' : 'stay off';  
  focus : string = (this.appService.getHistoryFocus() === true) ? 'focus on' : 'focus off';  
  // stay on will put you at the paid or adjusted claim
  // recent on will show the last several claims when going to history 

  lastClaim: string = '' 
  
  // enabled in environment
  focusOn  = this.appService.usingFocus(); 
  stayOn   = this.appService.usingStay();
  navOn    = this.appService.usingNav();
  actOn    = this.appService.usingAct();
  act1On = false;  // show hide act1 button.
  act2On = false;  // show hide act2 button.

  // action buttons - show last claims adjusted or paid.

  button1Text = '';
  button2Text = '';
  buttonCount = 0;
  // for loader 
  action1_claimId = '';
  action2_claimId = ''; 
 
  /*

    History options: 

    1. Stay on / Stay off = this button will allow the adjustment and payment
       process to return to the top of the history screen. Stay off - go back
       to menu.  Enabled by environment variable. 

    2. Focus on / Focus Off = Focus on setting causes screen to recenter
       on last paid or adjusted claim. Enabled
       by environment variable. Stay must be set to Stay on for this to be used. 

    3. Navigations - afer each claim in the list you see a top, mid, bottom
       to move screen to those locations. In addition the last 2 adjusted or
       paid claim numbers are buttoned so you can click to scroll to those 
       claims.   

       Environment variables: useStay, useFocus, useNav. 

  */

  totalClaimCount = 0;

  halfway = 0; // create id=mid in the html. 

  // screen navigation remember claim at top , middle, bottom
 

  actionLevel = 0;  // which action buttons are available from prior actions.  
 
  focusedClaimNumber : string = ''; 

  constructor(private claimService: ClaimService,
              private storageService: StorageService,
              private adjustmenService: AdjustmentService,
              private appService: AppService,
              private tokenService: TokenService,
              private router: Router) { }
 
  ngAfterContentInit() {

      try {
      setTimeout(function () {
        const element = document.querySelector('#focus');
        element?.scrollIntoView();
      },1750);
    } catch(Err:any) {
      console.log("scroll into view did not work");
      for(let p in Err) { console.log(p + ":" + Err[p]); }
    }
  
   }

   ngOnInit() {
  

              var notSignedIn = this.appService.notSignedIn();  
              if (notSignedIn == true) {
              
                this.router.navigate(['/splash']);   
              }

              this.histMessage = this.appService.getMessage();
              this.showHistMessage = (this.histMessage != ""); 

              // read current customer ID and populate claim array with
              // their claims - most recent first.
              debugger; 
              this.customerIdentification = this.storageService.fetchCustomerId();
              this.custNames = this.storageService.fetchNames();
              debugger;
              // test trap.
              if(this.customerIdentification === null) {
                this.message = 'you got here the wrong way....';
                return;
              }  

              // activity processing must be called first so we are aware of any recent claims. 
              this.activityProcessing();

              // read all claims into an array
              this.readHistory(this.customerIdentification);  

  
  } 
 

   
  onMenu() {  

    this.router.navigate(['/hub']);   

  }

  toggleStay() {
 
     let stay = this.appService.getHistoryStay();
     stay = !stay;
     this.appService.setHistoryStay(stay);
     //
     this.stay = stay ? "stay on" : "stay off";

  }

  
  toggleFocus() {
  
    let focus = this.appService.getHistoryFocus();
    focus = !focus;
    this.appService.setHistoryFocus(focus);
    //
    this.focus = focus ? "focus on" : "focus off";
    this.focusOn = focus; 

 }

  newClaim() { 
    
    this.router.navigate(['/claim']);  

  } 

  screenDate(value:string) { 
 
      // changes yyyy/mm/dd to mm/dd/yyyy show yyyy for dob  
      if(value === null) { 
         return 'n/a'; 
      }
      var year = value.substring(0,4);
      var day = value.substring(8,10);
      var month = value.substring(5,7);
      // ie 11 var result = `${month}/${day}/${year}` 
      var result = month + '/' + day + '/' + year;
      return result; 

  } 
 

   readHistory(id: string) { 
  

    this.focusedClaimNumber = this.appService.getFocusedClaim();  
    var envFocusVariableSettingOn = this.appService.usingFocus();
    var focusButtonOn = this.appService.getHistoryFocus();
    var foundFocusClaim = false;

    this.claimService.readClaimHistory(id).subscribe({
  
      next: (items: any) => {  

        debugger; 
        this.claims = items;
        this.claimCount = " of " + this.claims.length;
        var counter = 0;
        for(var c of this.claims) { 
           var claimIdNumber =  c.ClaimIdNumber.toString();  
           counter++;
          //  console.log("*** hist claim id read is: " + claimIdNumber); 
          c.Procedure1.trim();
          c.Procedure2.trim();
          c.Diagnosis1.trim();
          c.Diagnosis2.trim(); 
          c.DateService=c.DateService.substring(0,10);
          c.DateService=this.screenDate(c.DateService);
          c.DateAdded=c.DateAdded.substring(0,10);
          c.DateAdded=this.screenDate(c.DateAdded);

          var yConfine = c.DateConfine.toString().substring(0,4);
          var yRelease = c.DateRelease.toString().substring(0,4);
          c.DateConfine=(yConfine === null || yConfine==="1900" || yConfine==="1753") ? 'n/a' : this.screenDate(c.DateConfine.substring(0,10));
          c.DateRelease=(yRelease === null || yRelease==="1900" || yRelease==="1753") ? 'n/a' : this.screenDate(c.DateRelease.substring(0,10));
        
          c.DrugName=(c.DrugName===null) ? '' : c.DrugName;
          c.Eyeware=(c.Eyeware===null) ? '' : c.Eyeware;
          c.AdjustedDate=this.screenDate(c.AdjustedDate);
          c.PaymentDate = this.screenDate(c.PaymentDate); 
          var claimType = c.ClaimType.trim();
          switch(claimType) {
            case 'u' : c.ClaimType = 'Undefined'; break;
            case 'm' : c.ClaimType = 'Medical'; break;
            case 'd' : c.ClaimType = 'Dental'; break;
            case 'v' : c.ClaimType = 'Vision'; break;
            case 'x' : c.ClaimType = 'Drug'; break;
          }  
          // do not show adjust link 
          c.ClaimStatus = c.ClaimStatus.trim(); 

          
        if(c.ClaimIdNumber.trim() === this.action1_claimId)
        {
           c.Activity = 1;
        }
        if(c.ClaimIdNumber.trim() === this.action2_claimId)
        {
           c.Activity = 2;
        }

          // confine release if either is 1753-01-01 blank date data only leave header since
          // data line contains claim status at right...
           
          
          var cid = claimIdNumber.trim();
          var fid = this.focusedClaimNumber.trim();
          
          if(envFocusVariableSettingOn 
             && focusButtonOn 
             && cid === fid) { 

              // html will write div with id=#focus
              c.Focused = true; 
              foundFocusClaim = true;

          } 
        } 

        // reset focus
        if(foundFocusClaim) {

          // turn off the focus for next history screen. 
          this.appService.setFocusedClaim("");
          
        }
  
        var value: number = (this.claims.length === null) ? 0 : this.claims.length;
        var lit : string = '';
        switch(value) { 

          case 0:  lit = ' No claims found'; break;
          case 1:  lit = ' One claim found'; break;
          default: lit = value + ' claims found'; break; 

        }  
        this.message = lit;
        this.totalClaimCount = value;  
        this.halfway =  (this.totalClaimCount - (this.totalClaimCount % 2)) / 2;  
 
        

      },
      error: (Error) => {
 
        console.log('read history error:' + Error);  
        this.message = "error occurred reading claim history...";

      } 
      
    });
  } 
 
   activityProcessing() {

      // call this before claims are loaded so the
      // claim.activty flag can be set in the claim array 
      // similar to focus.

      this.button1Text = '';
      this.button2Text = '';
      this.buttonCount = 0;
      this.act1On = false;
      this.act2On = false; 

      if(this.actOn === false) { 
        return;
      }

      // activity structure
      var activity = { ClaimId: '', Action: '', Time: '' };

      var thisActiveButtonCount = this.appService.getActivityCount(); 

      for(var i = 1; i <= thisActiveButtonCount; i++) {

         var act = this.appService.getActivty(i);
         if(act !== null) {
           activity = act;
         }
         var claimId = activity.ClaimId;
         var action = activity.Action;

         // format button text
         var id = claimId.replace(":","");
         var claimId_last2 = id.substring(id.length-2);
         var act_first3 = action.substring(0,3);
         var button_face = act_first3 + "-" + claimId_last2;

         if(i === 1) { 
           this.button1Text = button_face;
           this.action1_claimId = claimId;
           this.act1On = true; 
         }
         if(i === 2) { 
 
          this.button2Text = button_face;
          this.action2_claimId = claimId;
          this.act2On = true;  
         } 
      } 

   }
  

   gotomenu() {

    this.router.navigate(['/hub']);  
      
   } 

   adjustClaim(claim: Claim) {  

      if(claim.ClaimStatus === "Adjusted") {
        alert('May not adjust claim - it is aleady adjusted.');
        return;
      }

      if(claim.ClaimStatus === "Paid") {
        alert('May not adjust claim - it is aleady Paid.');
        return;
      }

      // store claim id in adjustment service   
      this.adjustmenService.setClaimToAdjust(claim.ClaimIdNumber); 
      this.appService.setFocusedClaim(claim.ClaimIdNumber); 
      this.router.navigate(['/claim']);  
      

   }

  
   payClaim(claim: Claim) {

      debugger;
      if(claim.ClaimStatus === "Adjusted" || claim.ClaimStatus === "Paid") {
        alert('May not pay claim - it is : ' + claim.ClaimStatus.trim());
        return;
      }

      // Alert logic get input  
      var amount = this.getUserPaymentData();
      if(amount === 'notvalid') { // return to history screen }

          return; // to history 
      }
    

      var notUsed = '';
      var today = this.getCurrentDate();
      var serverAction = "pay"; // specific value for the server is needed here.
      var claimId = claim.ClaimIdNumber.trim(); 
      
      this.appService.setFocusedClaim(claimId);

      var cso: ClaimStatusObject = {claimIdNumber: claimId,
                                    action: serverAction,
                                    plan: notUsed,
                                    amount: amount,
                                    date: today,
                                    _csrf: ''}; 

      debugger;                        
      // add token
      cso['_csrf'] = this.tokenService.getToken();

      var closureThis = this;
      
       // calling claim service to pay claim 
       // ref: https://rxjs.dev/deprecations/subscribe-arguments

       /*
          notes: if subscribe has a error function wrap it
          all in an object with properties as arror functins.

          if it only has a next synax is simpler.

       */

       this.claimService.payClaim(cso).subscribe({

          next: () => {

            var a = claim.ClaimIdNumber.trim();
            var b = amount;
            // ie 11  var message =`Claim ${a} paid with $${b}`;
            var message = "Claim " + a + " paid with $" + b;

            
            // set activity for history screen buttons...
            this.appService.setActivity(claim.ClaimIdNumber.trim(),"Payment"); 

            // set focus on the paid claim 
            // since we are on the history screen reload the component
            // if stay on = on 
 
            var stayOnHistory = this.appService.getHistoryStay();
            if(stayOnHistory) {

               // set focus to paid claim
               this.appService.setFocusedClaim(a);

               this.appService.setFocusedType("Payment");

               // reload this screen and focus will position screen at paid claim
               //console.log("payment process calls ngOnInit.");
               //this.ngOnInit();
 
               // force a timely reload after the async completes.
               this.router.navigate(["/redirecthistory"]);  
               // exit
               return;

            }

            // return to hub - main menu
            var location = "/hub"; 
            this.appService.setMessage(message); 
            this.router.navigate([location]);  
            return;

          },
          error: (Error) => {
     

               var e = Error.message;
               var message = `An error occured while trying to pay claim ${e}`;
          }

        });  
   } 
   getUserPaymentData() : string {

     // use alert. 
     var def = "0";

     var paymentAmount: any = prompt("Please enter claim payment amount.",def)  
     if ( isNaN(parseFloat(paymentAmount)) == true ) {
 
         alert("Please enter numeric amount.");
         return '';
     }; 
     return paymentAmount; 
   }

   applyPaymentRules(value: number) : number {
 
      return 1; 
   }

   getCurrentDate() : string {
     
        let d = new Date();
        let yyyyN: number  = d.getFullYear();
        let mm: number = d.getMonth() + 1;
        let dd: number = d.getDate();  
        let yyyy = yyyyN.toString();
        var today = yyyy + '-' + this.pad2(mm) + '-' + this.pad2(dd); 
        return today; 
   }

   pad2(value: number ) : string { 

       var addZero = "0";
       var result : string = value.toString();
       if (result.length === 1 ) {
           result = addZero + result;
       }
       return result;
   } 
 
   removeClaim() {

    alert("Action is not activated at this time. Sorry.")
    return;
    
   }

}
