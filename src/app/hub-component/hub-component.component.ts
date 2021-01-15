import { Component, OnInit } from '@angular/core';

import AppService from '../app.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-hub-component',
  templateUrl: './hub-component.component.html',
  styleUrls: ['./hub-component.component.css']
})
export class HubComponentComponent implements OnInit {

  message: string = '';
  messages: string[] = [];

  constructor(private appService: AppService,
              private router: Router) { }


  //TODO x: hub, plan: install url protections
  //TODO: rename hub-compnent to hub  with component suffix.
  //TODO: see if link light is possible for A30.

  // present menu options

  ngOnInit(): void {


    var notSignedIn = this.appService.notSignedIn();   
    if (notSignedIn == true) { 
      this.router.navigate(['/splash']);   
    }

    // pending message check.
    var m1 = this.appService.getMessage();
    if(m1 != '') { 

       this.message = m1;
    } else {

       this.message = "Please make a selection";

    }

  }

  optionUpdate(): void {

    
    this.router.navigate(['/update']);   

  }

  optionPlan(): void {

    
    this.router.navigate(['/select-plan']);   
  }

  optionSignOut(): void { 

    
    this.router.navigate(['/signout']);   
  }

  optionClaim(): void {

    
    this.router.navigate(['/claim']);   
  }

  optionHistory(): void {

    
    this.router.navigate(['/history']);   
  }


}
