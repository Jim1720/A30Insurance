import { Component, OnInit} from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';  
import { AppService } from '../app/app.service';   

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
      historyDisplay: string = '';
      showColorControls: boolean = false; 
      showPicControls: boolean = true;
      
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
 


    constructor(private router: Router,
                private appservice: AppService)
    { 

      this.navStart = router.events.pipe( 
          filter(evt => evt instanceof NavigationStart) 
      ) as Observable<NavigationStart>;  

      

    }; 
 
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

      /* each navigation check pics on or off ; this works since
         clicking link causes navigation to splash. */ 
 
      this.picsLit = this.appservice.getLit(); 
      this.colorLit = this.appservice.getColor(); 

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
 
      this.showPicControls = true;
      this.showColorControls = false;
 
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
          this.setColorControl();
          this.menuSelected = true;
      }
      if( path === "/select-plan") {   

        this.out = false;
        this.in = true;
        this.registering = false; 
        this.setColorControl();
    }
      if( path === "/update") {   

        this.out = false;
        this.in = true;
        this.registering = false; 
        this.setColorControl();
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
          this.setColorControl();
          this.registerSelected = true;
      }
      if( path === "/about") {   

        this.out = true; /* still show the out links at this time */
        this.in = false;
        this.registering = false; 
        this.showColorControls = false;
        this.showPicControls = false; 
        this.aboutSelected = true;
     
    }
    if( path === "/splash") {   

      this.out = true; /* still show the out links at this time */
      this.in = false;
      this.registering = false; 
      this.showColorControls = false;
      this.showPicControls = false; 
      this.splashSelected = true;

     }
     if(path === "/classic") {   

      this.out = true; /* still show the out links at this time */
      this.in = false;
      this.registering = false; 
      this.showColorControls = false;
      this.showPicControls = false; 
      this.classicSelected = true;
     }
    if( path === "/signin") {   

      this.out = true; /* still show the out links at this time */
      this.in = false;
      this.registering = false; 
      this.showPicControls = false; 
      this.signinSelected = true;
    
      } 
      if( path === "/admin") {   

        this.out = true; /* still show the out links at this time */
        this.in = false;
        this.registering = false; 
        this.showPicControls = false;
        this.adminSelected = true;

     }
     if( path === "/custlist" ) {   

      this.out = true; /* still show the out links at this time */
      this.in = false;
      this.registering = false; 
      this.showPicControls = false; 

   }
   if( path  === "/reset") {   

    this.out = true; /* still show the out links at this time */
    this.in = false;
    this.registering = false; 
    this.showPicControls = false;  

 }

 if( path  === "/info") {   

  this.out = true; /* still show the out links at this time */
  this.in = false;
  this.registering = false; 
  this.showPicControls = false;  

}
     if( path === "/history") {
          console.log('sf')
          this.setFormat();  
          this.historySelected = true;
      } 

      if ( path === '/claim') {
        this.out = false;
        this.in = true;
        this.registering = false; 
        this.setColorControl();
        this.claimSelected = true;
      }

      if( path == '/adminaction' || path == '/custlist') {
        this.out = true;
        this.in = false;
        this.registering = false;  
      }

     
    
    }); 


  }

   setColorControl() { 

      var fmt = this.appservice.getFormat(); 
      this.showColorControls = (fmt === 'bg-outline' || fmt == 'bg-solid') ? true : false; 
   }

  onMenu() {

    // switch between menus
     this.useLinks = !this.useLinks;
     this.useMenu = !this.useMenu; 

  }

  onPics() {

     this.appservice.toggleFormat();  
     this.picsLit = this.appservice.getLit();
     this.setColorControl();
     // now we need to update the 
     // colors.
     

  }

  onHistToggleFormat() : void {

     // format is 'page' or 'scroll' - toggle between them.

     if(this.savePath === '/history') {} 
     else {
       return; // not on history screen ignore.
     } 

     this.setFormat();
  }

  setFormat() : void {

     // switch between page / scroll.
     var disp = this.appservice.toggleHistoryDisplay();  
     this.histPage = (disp == 'page');
     this.histScroll = (disp == 'scroll'); 
  }

  onHistMove(input: string) {

      // this will page as directed or move to top depending on format for history set.

      if(this.savePath === '/history') {} 
      else {
        return; // not on history screen ignore.
      }  
      var format = this.appservice.getHistoryDisplay();
      switch(format) {
        case 'histPage' : this.doPager(input); break;
        case 'histScroll' : this.doScroller(input); break;
        default: return;
      }
      

  }

  onColors() {

      // change color link.
      this.colorLit = this.appservice.toggleColor();

  }

    
  doPager(input:string) { 

      // page screen next, last, top, bottom

  }

  doScroller(input:string) {

     // may scroll to top.
  }



  title = 'A30Insurance'; 
  out: boolean = true;
  in:  boolean = false;
  registering: boolean = false;
  signedName: string = "John Smith"; 
  isExpanded: boolean; 

}

