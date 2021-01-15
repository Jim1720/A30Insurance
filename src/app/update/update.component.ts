import { Component, OnInit } from '@angular/core';  
import  Cust  from '../Cust';

import { Router } from '@angular/router';
import { CustomerService } from '../customer.service';
import { StorageService } from '../storage.service';
import { AppService } from '../app.service';
import ColorInfoObject from '../ColorInfoObject';
import DateEdit, { dateservice } from '../dateservice'; 
import { TokenService } from '../token.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit { 

  messages : string[] = [];
  showMessage: boolean = false;
  result: string = ''
  status: string = ''
  claimCountLit: string = ''; 
  actualClaimCount: number = 0;
  showPics: string = ''; 
  labelColor: string = '';
  hcolor: string = '';
 
  custId :  string = '';
  // on screen only - old password used when not keyed.

  entered :  string = '';
  confirmed: string = '';

  // password selected sent to update

  finalized: string = '';
  //


  custFirst :  string = '';
  custLast :  string = '';
  custMiddle: string = '';
  custPhone :  string = '';
  custEmail :  string = '';
  custBirthDate: string = '';
  custGender: string = '';
  custAddress1 :  string = '';
  custAddress2 :  string = '';
  custCity :  string = '';
  custState :  string = '';
  custZip :  string = ''; 
  custPlan: string = '';
  
  loadCust: Cust;
  currentCustId: string;
  goodEdit: boolean = true; 
  useColor: string = '';

  mainMessage: string = ''; // main message not error liste messages.

  
  // formattedDates for database: fdDateService 
  fBirthDate: string = '';

  constructor(private customerService: CustomerService,
    private storageService: StorageService, 
    private appService: AppService,
    private dateService: dateservice,
    private tokenService: TokenService,
    private router: Router) {};

  ngOnInit() {

    var notSignedIn = this.appService.notSignedIn();   
    if (notSignedIn == true) { 
      this.router.navigate(['/splash']);   
    }

     //this.showMessage = false; // stop ui bullett from appearing ; turn on if edits later too.
     // get claim added message
     /* moved to menu...
     var m1 = this.appService.getMessage();
     if(m1 != '') {
        //this.showMessage = true;
        this.mainMessage = m1;
     }*/
 

    // populate screen with customer data.
    // it comes from appCust not the database - save read. 
    debugger;
    this.loadCust = this.storageService.fetchCustomer();
    this.currentCustId = this.loadCust.custId.trim();
    //this.custPassword = this.loadCust.custPassword.trim(); // 2.28.20 fixed was custPass.
    this.entered = ""; // blank unless need to change..
    this.custFirst = this.loadCust.custFirst.trim();
    this.custLast = this.loadCust.custLast.trim();
    this.custEmail = this.loadCust.custEmail.trim();
    this.custMiddle = this.loadCust.custMiddle.trim();
    this.custPhone = this.loadCust.custPhone.trim();

    // register gives date of mm/dd/yyyy format 
    // dateabase gives 2020-01-01 time etc.  
    this.custBirthDate = this.pullDate(this.loadCust.custBirthDate); 

    this.custGender = this.loadCust.custGender.trim();
    this.custAddress1 = this.loadCust.custAddr1.trim();
    this.custAddress2 = this.loadCust.custAddr2.trim();
    this.custCity = this.loadCust.custCity.trim();
    this.custState = this.loadCust.custState.trim();
    this.custZip = this.loadCust.custZip.trim(); 

    this.custPlan = this.loadCust.custPlan.trim();
 
    //this.showPics = this.appService.getFormat();
    //console.log('update component show pics' + this.showPics)0

    
    this.showPics = this.appService.getFormat();
    this.useColor = this.appService.getColor(); 

     // subscribe to color changes from app.service.
     this.appService.subject.subscribe(
      // import ColorInfoObject from '../ColorInfoObject';
      // next branch
      (cio:ColorInfoObject) => {

           // change color and format 
           this.showPics = cio.format;
           this.useColor = cio.newColor;  
           this.labelColor = cio.labelColor;  
           let root = document.documentElement; 
           root.style.setProperty('--user-color', this.useColor); 
           root.style.setProperty('--h-color', this.hcolor);
           root.style.setProperty('--label-color', this.labelColor);
      },

      // error branch
      (Error) => {

          console.log('Error in update subscription ' + Error);

      }

  );
 

 
  }

  onUpdate(): void {

    this.messages = [];
    this.editFields();
    if(this.goodEdit === false) {
      this.showMessage = true;
      return;
    }
 

   var editDateParm = { input: "", screen: "", valid: false, formatted: "", message: ""}
   editDateParm.input = this.custBirthDate;
   editDateParm.screen = "update"; 

   debugger;
   this.dateService.editDate(editDateParm);  
   if(!editDateParm.valid) {  
       this.showMessage = true;
       this.messages[0] = editDateParm.message; 
       return;
   }  
   else { 
       this.fBirthDate = editDateParm.formatted; 
   }  

    let cust: Cust = new Cust();
    cust.custId= this.currentCustId; // input from storage , not screen.

    cust.custPassword = this.finalized.trim(); // edit put new or old password in this field.
    cust.entered = '' ; // not used screen edits only
    cust.confirmed = ''; // not used screen edits only
    
    cust.custFirst = this.custFirst;
    cust.custLast = this.custLast;
    cust.custMiddle = this.custMiddle;
    cust.custPhone= this.custPhone;
    cust.custEmail= this.custEmail;
    cust.custBirthDate = this.custBirthDate;
    cust.custGender = this.custGender;
    cust.custAddr1= this.custAddress1;
    cust.custAddr2= this.custAddress2;
    cust.custCity= this.custCity;
    cust.custState= this.custState;
    cust.custZip= this.custZip; 
    // custPlan is read only ; use plan screen to update it.
 
    cust.custBirthDate = this.fBirthDate;
    
    // add token
    cust._csrf = this.tokenService.getToken();
 

   debugger;
   let result = this.updateCustomer(cust);   
   // no check here : messages set in udpateCustomer
   // use check if need to transfer.
       
  } 

  getExistingPassword() {
 
    // when screen password is blank put the prior password in 
    this.loadCust = this.storageService.fetchCustomer(); 
    var value = this.loadCust.custPassword.trim(); // 2.28.20 fixed was custPass.
    return value;

  }

  editFields() {

      var name1 = "^[a-zA-Z0-9]+$";   // cust id / password ( + 1 or more;* 0 or more)
      var name2 = "^[a-zA-Z0-9.#\\s\\-\\.]+$"; //  names desc imbed blank required
      var addr2 = "^[a-zA-Z0-9.#\\-\\.]* || \\s"; // addr 2 is not req allow space. * o,more
      var phone = "^[0-9]{10}|\([0-9]{3}\)[0-9]{3}\-[0-9]{4}$";
      var email =  "^[0-9a-zA-Z]+@[0-9a-zA-Z]+.{1}[0-9a-zA-Z]+$"; 
      var gen = "^[MFmf]{1}$"; // match one  

      var msg: string[] = [];
      var pat1 = new RegExp(name1);
      var pat2 = new RegExp(name2); 
      var name2s = "^[a-zA-Z0-9.#\\s\\-\\.]*$"; //  middle optional
      var pPhone = new RegExp(phone);
      var pEmail = new RegExp(email);
      var pat2s = new RegExp(addr2); 
      var pGen = new RegExp(gen);

      var e = this.entered;
      var missing = (e === '' || e === undefined || e === null); 
      debugger;
      this.finalized = '';
      var good = true;
      if(!missing)
      {

          var enteredPassword = this.entered.trim();

          // edit new password.

          if(!pat1.test(enteredPassword)) { 
            good = false;
            msg.push('invalid password');
          }   
    
          if(enteredPassword !== this.confirmed.trim()) {
            good = false;
            msg.push('confirmation password does not match password.');
          }

          if(good) {
            
            this.finalized = this.entered.trim();

          }


      } else {

            // read from customer - use existing password on update.
            this.finalized = this.getExistingPassword();

      }

     
      if(!pat1.test(this.custFirst.trim())) { 
          msg.push('invalid first name ' + this.custFirst.trim()); 
       }
       if(!pat1.test(this.custLast.trim())) {
        msg.push('invalid last name '); 
       } 
       if(!pat2s.test(this.custMiddle.trim())) {  // used * not !!s to all blank.
        msg.push('invalid middle name '); 
       } 
       if(!pGen.test(this.custGender.trim())) {
        msg.push('invalid gender '); 
       } 
       if(!pat2.test(this.custAddress1.trim())) {
        msg.push('invalid address 1'); 
       } 
       if(!pat2s.test(this.custAddress2.trim())) {
        msg.push('invalid address 2'); 
       } 
       if(!pat2.test(this.custCity.trim())) {
        msg.push('invalid city'); 
       } 
       if(!pat1.test(this.custState.trim())) {
        msg.push('invalid state'); 
       } 
       if(!pat1.test(this.custZip.trim())) {
        msg.push('invalid zip'); 
       }
       if(!pPhone.test(this.custPhone.trim())) {
        msg.push('invalid phone'); 
       } 
       if(!pEmail.test(this.custEmail.trim())) {
        msg.push('invalid email'); 
       }  
 

       if(msg.length === 0) {
         return;
       } 
       this.goodEdit = false;
        
       for(var item of msg) {
         this.messages.push(item);
       }
  }

   
  onCancel() {  

    this.router.navigate(['/hub']);   

  }
 

  updateCustomer(cust: Cust) {
 
    debugger;

    var closureBindThis = this; // closure/bind so when aync finishes
    // we can update message - i call it closure/bind but it is called 'closure'.

    // we have to do this first 
    // subscrber gets a null copy of cust for storage. 
    // in good working conditions this is ok.
    // needed: for reading old password if user does not enter if.
    this.storageService.storeCustomer(cust);

    let result : boolean = false; 

    this.customerService.updateCustomer(cust).subscribe(

      (cust:Cust) => {
 
        debugger;
        result = true;  
        this.result = "good";
        this.messages[0]="information updated"; 
        // reset password field to blank on screen.
        this.entered = "";
        this.confirmed = "";
        //
        closureBindThis.mainMessage  = "Customer information updated.";
      },
      (Error) => {

        debugger;
        closureBindThis.messages[0] = "Could not update customer: " + Error; 
        this.result = "error";
      } 

    );  
  } 

  pullDate(value:string): string {  

    debugger;

    // can come from signin (the database) or (register) with
    // slightly different format.
    
    if(value.length > 10) { // from database 2020-01-01 etc.  
      var slash = "/";
      var work = value.substring(0,10);
      var yy = work.substring(2,4);
      var mm = work.substring(5,7);
      var dd = work.substring(8,10);
      var out = mm + slash + dd + slash + yy; 

    } else { // from register 01/01/2020 leave alone has slashes.
     
      out = value; // mm/dd/yyyy formatted date.

    }
    return out; 
  }

   
 

}
