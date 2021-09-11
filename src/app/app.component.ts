import { Component, OnInit} from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';  
import { AppService } from '../app/app.service';    
import BrowserDetect   from 'browser-detect'; // uat added 12.11.19 
import { ScreenStyleInterfaceService } from './screen.style.interface.service';
import ColorInfoObject from './ColorInfoObject';
import ScreenStyleObject from './ScreenStyleObject';
import { ScreenStyleNotificationSerevice } from './screen.style.nofification.service';
import { ScreenStyleAuthorizationService } from './screen.style.authorization.service';


import * as Rx from "rxjs"; 

// 8.7.2020 - corrected claim service inputs.

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit { 
 
      navStart: Observable<NavigationStart>;   

      /* select top menu */
      menuSwitchOptionEnabled:boolean = true // allow menu switching (dropdown/links)
      useMenu: boolean = false;
      useLinks: boolean = !this.useMenu;
      displayName: string = '';
      // end of menut set values.
 
      picsLit: string = 'No Pics'; 
      colorLit: string = '';
      histPage: boolean = false;
      histScroll: boolean = false;
      savePath: string = ''
      screenName: string = '';
      historyDisplay: string = '';
      showStyleLink: boolean = false; 
      showColorLink: boolean = true;
      colorLinkValue: string = '';
      styleLinkValue : string = "Style";
      
      DoNotUse: boolean = false; // added 2.24 compile erropr
      histPage1: boolean = false;
      histScroll1: boolean = false;

      classicSelected: boolean = false;
      splashSelected: boolean = false;
      registerSelected: boolean = false;
      signinSelected: boolean = false;
      adminSelected: boolean = false;
      aboutSelected: boolean = false;
      menuSelected: boolean = false;
      updateSelected: boolean = false;
      claimSelected: boolean = false;
      historySelected: boolean = false; 

      subject: any; // multi cast  


    constructor(private router: Router,
                private appservice: AppService,
                private styleinterface : ScreenStyleInterfaceService,
                private notificationService: ScreenStyleNotificationSerevice,
                private authorizationService: ScreenStyleAuthorizationService)
    { 

      // capture router events for logic below
      // to set link values etc.
      this.navStart = router.events.pipe( 
          filter(evt => evt instanceof NavigationStart) 
      ) as Observable<NavigationStart>;   

      this.adjustforie11();

    }; 

    
  adjustforie11() {

    /* IE 11 does not support solid, outline activity */

    var result: any = null;
    result = BrowserDetect();
    var name = result.name.toString(); 

    if(name == "ie")
    { 
        // limit styles use for ie - remove solid and colorstyles.
        this.styleinterface.accomodateie11();
    }

  } 
 
  onSwitchMenu() {

    // switch with drop down menu.
    this.useLinks = !this.useLinks;
    this.useMenu =  !this.useMenu;

  }

  ngOnInit() { 
 
    

    /* display name change when signin, register or signout. */

    /* define as @Output newEvent in appservice */ 
    this.appservice.signEvent.subscribe(evt => {

      debugger; 

      if(evt.signAction == "signin") {
       
           this.displayName = evt.customerName;
      }
      else { 

            this.displayName = "";
      }

    }) // end signinChange. 

    /* set up for navigation */
    this.navStart.subscribe(evt => { 
 

      /* collapse menu if in use */
      if(this.isExpanded === true) {
        this.isExpanded = false;
      }

      /* set in and out by the link selected from router event */ 
      // debugger;
      let path = evt.url; /* first route segment */ 
      this.savePath = path; // see onHist

      /* update is the entree into the application so we set 'in'
         signout is the exit so we set 'out'
         register is the entry way so to speak so we set registering */ 

      /* no entries for claim , or adjust */

    //  console.log('** navigation-router' + path);
 
      this.showStyleLink = false;
      this.showColorLink = false;
 
      this.classicSelected = false;
      this.splashSelected = false;
      this.registerSelected = false;
      this.signinSelected = false;
      this.adminSelected = false;
      this.signinSelected = false;
      this.aboutSelected = false;
      this.menuSelected = false;
      this.updateSelected = false;
      this.claimSelected = false;
      this.historySelected = false;


      if( path === "/hub") {   

          this.out = false;
          this.in = true;
          this.registering = false;  
          this.menuSelected = true;
      }
      if( path === "/select-plan") {   

        this.out = false;
        this.in = true;
        this.registering = false;  
    }
      if( path === "/update") {   

        this.out = false;
        this.in = true;
        this.registering = false;  
        this.updateSelected = true;
    }
      if( path === "/signout") {  
 
          this.out = true;
          this.in = false;
          this.registering = false; 
          this.splashSelected = true;
      }
      if( path === "/register") {   

          this.out = true; /* still show the out links at this time */
          this.in = false;
          this.registering = true;  
          this.registerSelected = true;
      }
      if( path === "/about") {   

        this.out = true; /* still show the out links at this time */
        this.in = false;
        this.registering = false;  
        this.aboutSelected = true;
     
    }
    if( path === "/splash") {   

      this.out = true; /* still show the out links at this time */
      this.in = false;
      this.registering = false;  
      this.splashSelected = true;

     }
     if(path === "/classic") {   

      this.out = true; /* still show the out links at this time */
      this.in = false;
      this.registering = false;  
      this.classicSelected = true;
     }
    if( path === "/signin") {   

      this.out = true; /* still show the out links at this time */
      this.in = false;
      this.registering = false;  
      this.signinSelected = true;
    
      } 
      if( path === "/admin") {   

        this.out = true; /* still show the out links at this time */
        this.in = false;
        this.registering = false;  
        this.adminSelected = true;

     }
     if( path === "/custlist" ) {   

      this.out = true; /* still show the out links at this time */
      this.in = false;
      this.registering = false;  

   }
   if( path  === "/reset") {   

    this.out = true; /* still show the out links at this time */
    this.in = false;
    this.registering = false;  

    }

    if( path  === "/info") {   

      this.out = true; /* still show the out links at this time */
      this.in = false;
      this.registering = false;  

    }

     if( path === "/history") { 
          this.historySelected = true;
      } 

      if ( path === '/claim') {
        this.out = false;
        this.in = true;
        this.registering = false;  
        this.claimSelected = true;
      }

      if( path == '/adminaction' || path == '/custlist') {
        this.out = true;
        this.in = false;
        this.registering = false;  
      }
 
      debugger;
      // set style and color links based on screen.
       this.screenName = path.substring(1);
       this.updateStyleAndColorLinks(this.screenName);

    }); 


  }

  updateStyleAndColorLinks(screenName:string) {

      debugger;
    //  console.log("** style link setter in action....");

       // set showPicControls and set showColorControls
      // picsLit and colorLit are the style and color link fields.
      // uses new interface in revised 2.0 coding

      this.showStyleLink = false;
      this.showColorLink = false;
      
      var appUsesStyles = this.authorizationService.stylesTurnedOn();
      if(!appUsesStyles)
      {
           return; // app does not use styles by environment variable.
      }

   //   console.log("app authorizes styles.");
   //   console.log('screen is : ' + screenName);

      var screenUsesStyles = this.authorizationService.stylesAllowedForScreen(screenName);
      if(!screenUsesStyles)
      {
             return;  // styles not allowd on screen.
      }

      
     // console.log("styles authorized for screen.");
      // styles are allowed set default link values ; that means
      // Style and no color link unless screen has had styles changed already
      // in that case the screen style object is queired for the style and color.

      var Style = "Style";
      this.showStyleLink = true;  // default value.
      this.styleLinkValue = Style;
      this.showColorLink = false; // default value.
      var notSetYet = null; 
       
      // find screen style object 

      var screenStyleObject = this.styleinterface.getStyleObject(screenName);
      if(screenStyleObject == notSetYet)
      {
          //  console.log("no style object");
         //   console.log("show style link: " + this.showStyleLink);
          //  console.log("show color link: " + this.showColorLink);
            return;
      }
 
      //  set links based on external class = style link and
      //  possibly color link for solid and outline styles.
       
      // set Style Link Value = internal class value 
     // console.log("found style object.");
      var Solid = "Solid";
      var Outline = "Outline";

      this.styleLinkValue = screenStyleObject.internalClass;

      var shouldWeSetColorLink = (screenStyleObject.internalClass == Solid ||
                                  screenStyleObject.internalClass == Outline);
                                
      if(shouldWeSetColorLink = true)
      {

          this.showColorLink = true;
          this.colorLinkValue = screenStyleObject.userColor;

      }

    //  console.log("show style link: " + this.showStyleLink);
    //  console.log("show color link: " + this.showStyleLink);
      

  }

  /* ------------------- style and color change routines ------------------------- */

  // respond to style link being clicked.
  onStyleChange() 
  {
      // call the factory to add or update existing screen style object
      // add used initially to create object for first style application
      // when none has been applied.

      debugger; 
      // update style object
      var styleObject = this.styleinterface.getNextStyle(this.screenName);
      //
      this.updateStyleAndColorLinks(this.screenName);
      // emit change to observer in the screen component 
      this.notifyScreenOfChange(styleObject); 
      //
     // console.log("----- style change dump ----");
      this.styleinterface.dump();
  }

  // respond to color link being clicked.
  onColorChange()
  {

      // update style object
      var styleObject = this.styleinterface.getNextColor(this.screenName);
      //
      this.updateStyleAndColorLinks(this.screenName);
      // emit change to observer in the screen component 
      this.notifyScreenOfChange(styleObject); 
       //
      // console.log("----- color change dump ----");
       this.styleinterface.dump();
  }

  notifyScreenOfChange(styleObject: ScreenStyleObject) { 

    var cio = new ColorInfoObject();
    cio.externalClass = styleObject.externalClass;
    cio.userColor = styleObject.userColor;
    cio.headerColor = styleObject.headerColor;
    cio.labelColor = styleObject.labelColor;
    cio.messageColor = styleObject.messageColor;
    // emit to observer on screens.
    this.notificationService.notifyScreensOfStyleOrColorChanges(cio);

  }


  onMenu() {

    // switch between menus
     this.useLinks = !this.useLinks;
     this.useMenu = !this.useMenu; 

  }
 
 
  title = 'A30Insurance'; 
  out: boolean = true;
  in:  boolean = false;
  registering: boolean = false;
  signedName: string = "John Smith"; 
  isExpanded: boolean = false;

}

