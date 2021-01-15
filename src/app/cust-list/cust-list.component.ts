import { Component, OnInit } from '@angular/core';
import CustomerService from '../customer.service';
import Cust from '../Cust'; 
import { Router } from '@angular/router';
import AppService from '../app.service';
 

@Component({
  selector: 'app-cust-list',
  templateUrl: './cust-list.component.html',
  styleUrls: ['./cust-list.component.css']
})
export class CustListComponent implements OnInit {

  constructor(private customerService: CustomerService,
              private appService: AppService, 
              private router: Router ) { }

  message: string = '';
  result: string = '';
  custList : Cust[];

  ngOnInit() { 


    var notSignedIn = this.appService.adminNotSignedIn();
    if (notSignedIn == true) { 
        this.router.navigate(['/splash']);   
    } 

     this.listCustomers();
  } 

  listCustomers() { 
 
      debugger;
  
      let result : boolean = false;
  
      this.customerService.listCustomers().subscribe(
        (cust:any) => {
   
          debugger;
          result = true; 
          this.custList = cust;
          this.message = "Success - information updated.";
          this.result = "good";
  
        },
        (Error) => {
  
          debugger;
          this.message = "Could not list customers: " + Error; 
          this.result = "error";
        } 
  
      );  
    } 

   
  onReturn() { 
  
    this.router.navigate(['/admaction']);   

  }

}
