import { Component, OnInit } from '@angular/core';
import { ClaimService } from '../claim.service';
import { StorageService } from '../storage.service'; 
import  Claim  from '../Claim';  
import { AdjustmentService } from '../adjustment.service';  
import { Router } from '@angular/router'; 
import AppService from '../app.service';
import ClaimStatusObject from '../ClaimStatusObject';

import { TokenService } from '../token.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  claims: Claim[]  =  [];
  customerIdentification: string = ' ';
  message: string = '';
  custNames: string = '';
  displaySequence: string = ' 1 of '; // place holder
  claimCount: string = ''; 
  histMessage: string = '';
  showHistMessage: boolean = false;

  constructor(private claimService: ClaimService,
              private storageService: StorageService,
              private adjustmenService: AdjustmentService,
              private appService: AppService,
              private tokenService: TokenService,
              private router: Router) { }

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
              this.readHistory(this.customerIdentification);  

  }

  
   
  onMenu() {  

    this.router.navigate(['/hub']);   

  }

  screenDate(value:string) { 
 
      // changes yyyy/mm/dd to mm/dd/yyyy show yyyy for dob 
  //    console.log('in' + value);
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
 
    debugger;
//    console.log('read history setting up observer...') 

    this.claimService.readClaimHistory(id).subscribe(
  
      (items: any) => { 

        debugger; 
        this.claims = items;
        this.claimCount = " of " + this.claims.length;
        for(var c of this.claims) { 
          var claimIdNumber =  c.ClaimIdNumber.toString();
     //     console.log("*** hist claim id read is: " + claimIdNumber); 
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
          debugger; 
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
          // adjustment note  
          var stat = c.ClaimStatus;
          // confine release if either is 1753-01-01 blank date data only leave header since
          // data line contains claim status at right...
          
        }

    //    console.log('observer read claim history - cust id:' + id) 
        debugger;  
        var value: number = (this.claims.length === null) ? 0 : this.claims.length;
        var lit : string = '';
        switch(value) { 

          case 0:  lit = ' No claims found'; break;
          case 1:  lit = ' One claim found'; break;
          default: lit = value + ' claims found'; break; 

        }  
        this.message = lit;
      },
      (Error) => {

        debugger;
        console.log('read history error:' + Error);  
        this.message = "error occurred reading claim history...";

      } 
      
    );
  } 
 
 
   showDetail(index:any) {

      alert(index);

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
       this.claimService.payClaim(cso).subscribe(

          () => {

            var a = claim.ClaimIdNumber.trim();
            var b = amount;
            // ie 11  var message =`Claim ${a} paid with $${b}`;
            var message = "Claim " + a + " paid with $" + b;
            closureThis.showHistMessage = true;
            closureThis.histMessage = message;
            // stays on history screen. 
            return;

          },
          (Error) => {

               var e = Error.message;
               var message = `An error occured while trying to pay claim ${e}`;
          }

       ); 
     


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
