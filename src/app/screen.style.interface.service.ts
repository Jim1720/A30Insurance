
// screen.style.interface.service.ts
//
//
//  router logic interacts with this service to set style links etc.
//
//   uses: appService to chck if styles are allowd
//   uses: style factory to read color link color.
//

import { Injectable } from '@angular/core';  
import  { AppService }  from './app.service';
import { ScreenStyleFactoryService }  from './screen.style.factory.service'; 
import ScreenStyleObject from './ScreenStyleObject'; 


@Injectable({
    providedIn: 'root'
  })
  

export class ScreenStyleInterfaceService  {  
 
  constructor(private fs: ScreenStyleFactoryService,
              private as : AppService) {};

  getNextStyle(screenName: string) : ScreenStyleObject {

    return  this.fs.getNextStyle(screenName);

  }

  getNextColor(screenName: string) : ScreenStyleObject  {

    return  this.fs.getNextColor(screenName); 

  }

  getStyleObject(screenName: string) : ScreenStyleObject
  {

     return this.fs.getScreenStyleObject(screenName);

  } 
 

 accomodateie11()
 {

    this.fs.accomodateie11();

 }

 dump() {

   this.fs.dump();
   
 }

};


