import { Injectable, EventEmitter, Output } from '@angular/core'; 
import * as Rx from "rxjs"; 
import ColorInfoObject  from '../app/ColorInfoObject';
import SignStatusObject from '../app/SignStatusObject'

import BrowserDetect   from 'browser-detect'; // uat added 12.11.19 
//TODO update to jscore3.
 
import { environment } from './../environments/environment';
import Environment from './Environment';
import { EnvironmentService } from './EnvironmentService'; 

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

  //TODO: change fore colors if solid color conflicts
  //TODO: npm component for browser detct

  //show: string[] = [ 'bg-image', 'bg-outline', 'bg-solid', 'Style'];
  //lit: string[] =  [ 'pic', 'outline', 'solid', 'Style']; 

  // setList populoates these.
  show: string[] = [];
  lit: string[] = [];
 

  index: number = 3; // first time defaults to none.
  max: number = 3; 
  subject: any; // multi cast
  

  historyIndex: number = 1;
  historyIndexMax: number = 1;
  history: string [] = ['page', 'scroll']; 
  
  // double click changes shade to dark or light so the final color
  // is formed by shade + color when possible.
  colors: string[] = [ 'white','red','pink', 'blue','aqua', 'yellow', 'green', 'lawngreen','gold', 'goldenrod'];
  shade: string = '';
  colorIndex: number = 0; 

  // header color h2 etc.
  hColor: string = '';

  // color on field labels. modified when background is solid color.;
  labelColor: string = '';

  // modify header colors and label colors based on this list for visability.
  lightColors: string [] = ['white','pink', 'aqua', 'yellow', 'lawngreen', 'gold'];

  constructor() { 

    this.subject = new Rx.Subject<ColorInfoObject>(); 
    this.setList();

  };  
  

  setList() {

    /* IE 11 does not support solid, outline activity */

    var result = BrowserDetect();
    var name = result.name.toString(); 

    if(name == "ie") { 
    
      this.show  = [ 'bg-image',  'Style'];
      this.lit  =  [ 'pic',  'Style']; 
      
      


    } else {
       
      this.show  = [ 'bg-image', 'bg-outline', 'bg-solid', 'Style'];
      this.lit  =  [ 'pic', 'outline', 'solid', 'Style']; 

    }

    this.index = this.show.length - 1;
    this.max = this.index;  

  }
 
  public toggleFormat() { 
    
    this.index++;
    if(this.index > this.max) {
      this.index = 0;
    }

    this.useCurrentColor(); // adjust colors as needed for new formate fix:12.11.
    // this is a bug because cio set below in useCurrentColor.
    /*var cio = new ColorInfoObject();
    cio.format = this.show[this.index];
    cio.newColor = this.shade + this.colors[this.colorIndex]; 
    this.subject.next(cio); */

  } 

  public getFormat() : string {
   
      return this.show[this.index];
    
  }

  public getLit() : string {

    return this.lit[this.index];

  }

  public toggleHistoryDisplay() : string {

    this.historyIndex++;
    if(this.historyIndex > this.historyIndexMax) {
      this.historyIndex = 0;
    } 
    return this.history[this.historyIndex];
  }

  public getHistoryDisplay() : string {
    // no sperate literal
    return this.history[this.historyIndex];
  }

   public getColor() : string { 

      return this.shade + this.colors[this.colorIndex];
   }

    public useCurrentColor() { 
      
      // called in ngInit on all components.
      var currColor = this.shade + this.colors[this.colorIndex];
      this.offsetColors(currColor);
      this.emitColor(currColor); 
      return currColor;

   }

   public toggleColor() : string {

    this.colorIndex++;
    if (this.colorIndex >= this.colors.length) {
      this.colorIndex = 0;
    } 
    var newColor = this.shade + this.colors[this.colorIndex];
    this.offsetColors(newColor);
    this.emitColor(newColor);
    return newColor;

   }

   public offsetColors(newColor: string) {
      debugger;
      var format = this.getFormat();
      console.log('*offset colors format is:' + format);
      if(format == "Style" || format == "bg-image") { 
         // background will be black in all cases if 'solid' is not used.
         this.hColor = 'white'; 
         this.labelColor = 'dodgerblue'; 
         return;
      } 
      // if style outline just use white and dodger
      if(format === "bg-outline") {
         this.hColor = 'white';
         this.labelColor = 'dodgerblue'; 
         return;
      }
      console.log('offset - color background process');
      // set labels and hx colors to offset selected color for visability.
      var lightColor: any = this.lightColors.find( c => c  === newColor);
      // returend 'undefined' or value.
      var lightColorUsed: boolean = typeof(lightColor) === "undefined" ? false:true; 
      if(lightColorUsed === true) {  
        this.labelColor = 'black';
      }
      else
      { 
        this.labelColor = 'white';
      }  
      
      this.setHColor(newColor);
   }
   setHColor(newColor:string) {

      let useWhite: string[] = ['red','blue','green'];
      let useGoldenRod: string[] = [];
      let useBlack: string[] = ['white','yellow','lawngreen','yellow','pink','aqua','gold','goldenrod'];

      this.hColor = 'aqua'; // signals unassigned - something went wrong.
      if( useWhite.indexOf(newColor) > -1) { this.hColor = 'white' }; 
      if( useGoldenRod.indexOf(newColor) > -1) { this.hColor = 'goldenrod' }; 
      if( useBlack.indexOf(newColor) > -1) { this.hColor = 'black' }; 
 
   }

   public emitColor(newColor: string) : void {

        var cio = new ColorInfoObject();
        cio.format = this.show[this.index];
        cio.newColor = newColor;
        cio.hColor = this.hColor;
        cio.labelColor = this.labelColor;
        this.subject.next(cio); 
   }

   public toggleShade(input:string) : string {

       // not used at this time.
       var newShade = '';
       switch(input) {
         case 'dark' : newShade = ''; break;
         case 'light' : newShade = 'dark'; break;
         case '' : newShade = 'light'; break;
       }
       return newShade;
   }

   public getApiUrl() : string {

    // when moving to production change this:
    // claim service, customer service use this.

    //TODO: recompile for prod

    // return 'azure=prod-link'

    // all local. all test.
 

    const urlPrefix = environment.urlPrefix; 
    
   // return "http://localhost:3200/";

    return urlPrefix;

   }

}

export default AppService;

