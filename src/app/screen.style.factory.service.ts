

// screen.style.factory.service.ts

/* creation and maintenance of screen style objects */ 

import { Injectable } from '@angular/core';  
import AppService from './app.service';
import ScreenStyleObject from './ScreenStyleObject'; 


@Injectable({
    providedIn: 'root'
  })
  
  export class ScreenStyleFactoryService  {  

     // when style/color is selected an object is added/replaced in the list
     // iniitally screens have no style objects and use default values.

     // app service has routines to authorize styles for app and for each screen.

     constructor(private appService: AppService) {};

     screenStyleObjectList : ScreenStyleObject[] = [];

     internalClassList : string[] = ["style", "picture","outline","solid"];
     externalClassList : string[] = ["bg-style","bg-image","bg-outline","bg-solid"];

     userColors : string[] = ["white", "red" , "pink","blue","aqua","yellow","green","lawngreen","gold","goldenrod"];
     labelColors: string[] = ["black" , "white","red","white","blue","black","white","black","brown","brown"];
     headerColors: string[] = ["black" , "white", "red","white","blue","black","white","black","brown","brown"];
     messageColors: string[] = ["black" , "white", "red","white","blue","black","white","black","brown","brown"];

     // this is only called when style link is visable 
     // which is determined by appService functions.

     getNextStyle(screenName: string) : ScreenStyleObject {

        // update/add screen style list object for screen.
        var screenStyleObject = this.getScreenStyleObject(screenName);
        var needNewObject = screenStyleObject == null;
        if(needNewObject) {

            this.CreateNewScreenStyleObject(screenName);
            
        }
        else { 

            this.UpdateExistingScreenStyleObject(screenName);

        }

        return this.getScreenStyleObject(screenName);

     }

     getScreenStyleObject(screenName: string) : ScreenStyleObject {

        // returns null or the object for screen.

         var result : any = null;

         this.screenStyleObjectList.forEach(s => {
            
            if (s.screenName == screenName)
            {
                result = s;
            }

         });

         return result; 
         
     }
     
     CreateNewScreenStyleObject(screenName: string) : void { 
        
        var n = new ScreenStyleObject;
        //
        // default values - first style is 'picture'.
        //
        n.screenName = screenName; 
        n.externalClass = "bg-image";
        n.internalClass = "picture";
        n.userColor = "white";
        n.labelColor = "white";
        n.messageColor = "white";
        n.headerColor = "white";
        //
        this.screenStyleObjectList.push(n);

     }


     UpdateExistingScreenStyleObject(screenName: String) : void {

        // match internal style and use next one in list.
        var solid = "solid";
        var outline = "outline";
        var picture = "picture";
        var style = "style";
        var userColor = "";
        var labelColor = "";
        var headerColor = "";
        var messageColor = "";
        var white = "white";
        var dodgerblue = "dodgerblue";
        var first = 0;


        this.screenStyleObjectList.forEach( (s, index, array) => {

            if(s.screenName == screenName) {

                var currentInternalClass = s.internalClass;
                // get next values
                var index = this.getNextIndex(currentInternalClass, this.internalClassList);
                // 
                var internalClass = this.internalClassList[index];
                var externalClass = this.externalClassList[index];
                switch(internalClass)
                {
                    case style: 
                        userColor =  white;
                        labelColor = dodgerblue;
                        messageColor = white;
                        headerColor = white;
                        break;
                    case picture:
                        userColor =  white;
                        labelColor = white;
                        messageColor = white;
                        headerColor = white;
                        break;
                    case outline:
                        userColor =  this.userColors[first]; 
                        userColor = 
                        labelColor = dodgerblue
                        messageColor = white;
                        headerColor = white;
                        break;
                    case solid:
                        userColor =  white;  
                        labelColor = this.labelColors[first];
                        messageColor = this.messageColors[first];
                        headerColor = this.headerColors[first];
                        break;
                    default:
                         break; 
                }
                //
                s.internalClass = internalClass;
                s.externalClass = externalClass;
                s.userColor = userColor;
                s.labelColor = labelColor;
                s.messageColor = messageColor;
                s.headerColor = headerColor; 

            } 

        });
          

    }

    getNextIndex(value: string, array:  any) : number {

         var index = -1;
         var firstInList = 0;

         for(var i = 0 , match = false; i < array.length; i++) {

                if(array[i] == value) {

                    match = true;
                    index = i + 1;

                }

         };

        var result = (index < array.length) ? index: firstInList;
        
        return result;

    }

    getNextColor(screenName: string) : ScreenStyleObject {

        // advance color for screens using Solid or Outline. 
         // color link only shows for solid or outline.
         var solid = "solid";
         var outline = "outline"; 
         var dodgerblue = "dodgerblue";
         var white = "white";

        this.screenStyleObjectList.forEach( (s, index, array) => {

           

            if(s.screenName == screenName) {

                var currentColor = s.userColor;
                var index = this.getNextIndex(currentColor, this.userColors);
                var internalClass = s.internalClass;
                switch(internalClass) {

                   case solid:

                        s.userColor = this.userColors[index];
                        s.labelColor = this.labelColors[index];
                        s.messageColor = this.messageColors[index];
                        s.headerColor = this.headerColors[index];
                        break;

                   case outline:
                       
                        s.userColor = this.userColors[index];
                        s.labelColor = dodgerblue;
                        s.messageColor = white;
                        s.headerColor = white;
                        break;
                    
                   defaut:
                      break;


                }


            }; 
        }); 

        
        return this.getScreenStyleObject(screenName);
    }

    accomodateie11() {
 
        // accomodate IE11 
        this.internalClassList  = ["style", "picture"];
        this.externalClassList = ["bg-style","bg-image"];

    }

    dump() {

        for(var i = 0 ; i < this.screenStyleObjectList.length; i++)
        {

            console.log('style entry' + i);
            var o = this.screenStyleObjectList[i];
            console.log(o.screenName);
            console.log(o.externalClass);
            console.log(o.internalClass);
            console.log(o.userColor);
            console.log("");

        }
    }

  };