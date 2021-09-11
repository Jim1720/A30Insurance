import { Component, OnInit, AfterViewInit } from '@angular/core';   
import Cust from '../Cust';
import { CustomerService } from '../customer.service'; 
import { StorageService } from '../storage.service';
import { AppService } from '../app.service'; 
import { Router } from '@angular/router'; 
import ColorInfoObject from '../ColorInfoObject';
import   DateService     from '../dateservice'; 

import { TokenService } from '../token.service';
import  AuthorizationObject from '../AuthorizationObject';
import { componentFactoryName } from '@angular/compiler';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  { 
 
  messages: string[] = [];
  message: string = ''; // comp error 2.24
  custId: string = '';
  scustPassword: string = ''; // fix blank ie 11 bug pw is blank.
  scustPassword2: string = '';
  custPass: string = ''; // compat 2.24
  custFirst: string = '';
  custLast: string = '';
  custMiddle: string = '';
  custPhone: string = '';
  custEmail: string = '';
  custBirthDate: string = '';
  custGender: string = 'M';
  custAddress1: string = '';
  custAddress2: string = '';
  custCity: string = '';
  custState: string = 'WA'; // for drowdown
  custZip: string = ''; 
  promotionCode: string = '';  
  goodEdit: boolean = false; 
  step: string = 'first'; 
  lineMessage: string = '';
  registerErrors: boolean = false;

  
  // formattedDates for database: fdDateService 
  fBirthDate: string = '';

  constructor(private customerService: CustomerService,
              private storageService: StorageService,
              private appService: AppService,
              private dateService: DateService, 
              private tokenService: TokenService,
              private router: Router) {};

  

 

  onCancel(): void {

    
    this.router.navigate(['/splash']); 


  }

  
    

  onRegister(): void {   
       

        if(this.custId === '') {  

        //this.messages[0] = "Please enter customer Id."
        
        this.lineMessage = "Please enter customer Id."
        this.registerErrors = true;
        return;
        }  

        if(this.scustPassword === '') {  

          //this.messages[0] = "Please enter a password."
          
          this.lineMessage = "Please enter a password." 
          this.registerErrors = true;
          return;
        }  

        if(this.scustPassword2 === '') {  

         // this.messages[0] = "Please enter a confirmation password."
          
          this.lineMessage = "Please enter a confirmation password." 
          this.registerErrors = true;
          return;
        }  

        if(this.scustPassword2 !== this.scustPassword) {

          //this.messages[0] = "Confirmation password does not match."; 
          
          this.lineMessage = "Confirmation password does not match."; 
          this.registerErrors = true;
          return;
        }  

     
          
        this.messages = [];
        this.editFields();
        if(this.goodEdit === false) {
          return;
        }  

        // if(this.editDate(this.custBirthDate, 'doEdit') == false)
        
        var dateEditResult: boolean = false; 
        // do not use tuple for other lang compat: javascript when rtn copied...
        var editDateParm = { input: "", screen: "", valid: false, formatted: "", message: ""}
        editDateParm.input = this.custBirthDate;
        editDateParm.screen = "register"; 
        debugger;
        this.dateService.editDate(editDateParm); 
        // debugging in until all other screens checked so 
        // we can retest if needed...

        var debug = false;

        if(debug) { 

                if(!editDateParm.valid) {  
                    this.messages[0] = editDateParm.input + " " + editDateParm.message;  
                    this.lineMessage = editDateParm.input + " " + editDateParm.message;  
                    this.registerErrors = true;
                    return;
                }  
                else {
                    this.fBirthDate = editDateParm.formatted; 
                    this.messages[0] = editDateParm.formatted + " " + "is a good date."
                    this.lineMessage = editDateParm.formatted + " " + "is a good date."
                    return; 
                }  

        } /* end debug */

        if(!debug) { 

          if(!editDateParm.valid) {  
            this.messages[0] = editDateParm.message;   
            this.lineMessage = editDateParm.message;  
            this.registerErrors = true;
            return; 
          }
          else { 
                this.fBirthDate = editDateParm.formatted; 
            }  
         } 

        // if step 'first' stop and confirm
        if (this.step === 'first') {

          this.messages[0] = "please verify and submit again, thank you."; 
          this.lineMessage = "please verify and submit again, thank you."; 
          this.registerErrors = true; // no errors but show message field at bottom.
          this.step = 'two';
          return;

        }

        debugger;
        let cust: Cust = new Cust();
        cust.custId= this.custId,
        cust.custPassword = this.scustPassword,   // try ie11 fix.
        cust.custFirst = this.custFirst,
        cust.custLast = this.custLast,
        cust.custPhone= this.custPhone,
        cust.custEmail= this.custEmail,
        cust.custAddr1= this.custAddress1,
        cust.custAddr2= this.custAddress2,
        cust.custCity= this.custCity,
        cust.custState= this.custState,
        cust.custZip= this.custZip   
        cust.appId = 'A30';
        cust.Encrypted = "";
        cust.custPlan = "";
        cust.PromotionCode = this.promotionCode;
        cust.extendColors = "0";
        cust.custMiddle = this.custMiddle;
        cust.custGender = this.custGender.toUpperCase();
        debugger; 
        cust.custBirthDate = this.fBirthDate;

        // add token
        cust._csrf = this.tokenService.getToken();
 
        
       
       this.addCustomer(cust);   
  }

  addCustomer(cust: any) {
 
    
    this.customerService.readCustomer(cust.custId).subscribe( 

      (authorizationObject: AuthorizationObject) => {

        
         if(authorizationObject.Status === "Successful") {

            this.messages[0] = 'CustomerId is already in use.';
            this.lineMessage = "Customer Id aleady exists.";
            this.registerErrors = true;
            
         } else {

            this.insertCustomer(cust);

         };

      },
      (Error) => {

         console.log('routine addCustomer: error: ' + Error);
      } 
    );

  }

  insertCustomer(cust:Cust) {

    let result : boolean = false;
    var closureThis = this;  
    debugger;

    // compatability
    cust.custPass = cust.custPassword.toString().trim();

    this.customerService.registerCustomer(cust).subscribe(

         (authorizationObject:AuthorizationObject) => {
 
        // authorized!
        if(authorizationObject.Status === "Successful") {

            debugger;
            this.storageService.storeCustomer(authorizationObject.Customer);
            var customerName = authorizationObject.Customer.custFirst +
                              authorizationObject.Customer.custLast; 
            debugger; 
            this.appService.signAction("signin",customerName); 
            var msg = 'Registered -- update info here.';
            this.appService.setMessage(msg);
            // get token form cust prop and recreate object.
            var token = JSON.parse(authorizationObject.Token);
            // store it.
            closureThis.tokenService.setToken(token);
            //
            this.router.navigate(['/select-plan']);   

        } else {
 
            this.messages[0] = authorizationObject.Message;
            this.lineMessage = authorizationObject.Message; 
            this.registerErrors = true;
            return;

        }

      },
      (Error) => {

        console.log('add cust:' + Error);
        this.messages[0] = "Could not add customer: " + Error; 
        this.lineMessage = "Could not add customer: " + Error;  
        this.registerErrors = true;
        return; 

      }
      
    );
  
  }


  editFields() {

    this.goodEdit = true; 

    var name1 = "^[a-zA-Z0-9]+$";   // cust id / password  1.more
    var name2 = "^[a-zA-Z0-9.#\\s\\-\\.]+$"; //  names desc imbed blank required 
    var name2s = "^[a-zA-Z0-9.#\\s\\-\\.]*$"; //  middle optional
    var addr2 = "^[a-zA-Z0-9.#\\-\\.]* || \\s"; // addr 2 is not req allow space. * o,more
    var phone = "^[0-9]{10}|\([0-9]{3}\)[0-9]{3}\-[0-9]{4}$";
    var email =  "^[0-9a-zA-Z]+@[0-9a-zA-Z]+.{1}[0-9a-zA-Z]+$";
    var gen = "^[MFmf]{1}$"; // match one 

    var msg: string[] = [];
    var pat1 = new RegExp(name1);
    var pat2 = new RegExp(name2); 
    var pat2s = new RegExp(name2s);
    var pat2s = new RegExp(addr2);
    var pPhone = new RegExp(phone);
    var pEmail = new RegExp(email);
    var pGen = new RegExp(gen);

    if(!pat1.test(this.custId.trim())) { 
        msg.push('invalid customer id ' + this.custFirst.trim()); 
    }
    if(!pat1.test(this.scustPassword.trim())) {
      msg.push('invalid password '); 
    } 
    if(!pat2.test(this.custFirst.trim())) { 
        msg.push('invalid first name ' + this.custFirst.trim()); 
     }
     if(!pat2.test(this.custLast.trim())) {
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
         msg.push('invalid zip code'); 
     } 
     if(!pPhone.test(this.custPhone.trim())) {
      msg.push('invalid phone - use: 1112223333 '); 
     } 
     if(!pEmail.test(this.custEmail.trim())) {
      msg.push('invalid email'); 
     }  
  

     if(msg.length == 0) {

       return;  
     }
      
     var prefix = " * ";
     for(let item of msg) {
       this.messages.push(item)
       this.lineMessage += prefix;
       this.lineMessage += item;
     } 
     
     this.registerErrors = true;
     this.goodEdit = false; 
    }

   
 
}
