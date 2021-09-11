
// screen.style.authorization.service.ts
 
/* Determine if styles are in use for the app and the screen. */

import { Injectable } from '@angular/core';   
import { environment } from './../environments/environment';   

@Injectable({
    providedIn: 'root'
  })
  
  export class ScreenStyleAuthorizationService  {  

    

   public stylesTurnedOn() : boolean {

    // Y or N set 

    const useStyles = environment.useStyles;

    return useStyles;

 }

 public stylesAllowedForScreen(screen: string) : boolean {

      const screensWithStylesAllowed: String[] = ["update", "claim"]; 
      
      var allowed = false;

      for(var i = 0 ; i < screensWithStylesAllowed.length; i++) {

           if(screen == screensWithStylesAllowed[i]) {

               allowed = true;

           }

      }


      return allowed; 
 } 
    
  };