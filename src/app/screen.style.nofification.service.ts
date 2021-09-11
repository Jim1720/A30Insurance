

// screen.style.notification.service.ts

/* app.component calls this service to emit 
   Color Information Objects (CIO's) 
   to the screens to change colors prompted
   by the appComponent.htm having the style or
   color links clicked.
*/

import { Injectable } from '@angular/core';   
import ColorInfoObject from '../app/ColorInfoObject'; 
import * as Rx from "rxjs";  

@Injectable({
    providedIn: 'root'
  })
  
  export class ScreenStyleNotificationSerevice  {  

    
    subject: any; // multi cast  

    constructor() {

      // emit style / color changes to screens when
      // style or color link clicked.
      // the update and claim screens have observers
      // to 'catch' the change and adjust styles and colors.
      this.subject = new Rx.Subject<ColorInfoObject>(); 

    }

    // tell screens style or color has changed.
    notifyScreensOfStyleOrColorChanges(cio: ColorInfoObject)
    { 
        this.subject.next(cio); 
    }

    
};