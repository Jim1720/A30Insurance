import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { AppService } from '../app.service';
import { PlanService } from '../plan.service';
import { StorageService } from '../storage.service';
import { TokenService } from '../token.service';
import { CustomerService } from '../customer.service';
import Cust from '../Cust';
import PlanInfo from '../PlanInfo'
import PlanParm from '../PlanParm'; 
import { NonNullAssert } from '@angular/compiler';

@Component({
  selector: 'app-select-plan',
  templateUrl: './select-plan.component.html',
  styleUrls: ['./select-plan.component.css']
})
export class SelectPlanComponent implements OnInit {

  message: string = '';  
  planInfo: PlanInfo[] = [];
  cust: any = NonNullAssert; 
  selectedPlan: string = '';


  constructor( private appService: AppService,
               private planService: PlanService,
               private tokenService: TokenService,
               private storageService: StorageService,
               private customerService: CustomerService,
               private router: Router) { }

  ngOnInit() {
 
    var notSignedIn = this.appService.notSignedIn();   
    if (notSignedIn == true) { 
      this.router.navigate(['/splash']);   
    } 

    debugger;
 //   console.log('select plan - on init'); 
    this.setupPlanInformation();
  }

  setupPlanInformation() {

    this.planService.readPlans().subscribe(

      (planInfoData:any) => {

         debugger;   
        // console.log(" *** plan info read from service "); 
         debugger;
         this.planInfo = planInfoData;

      },
      (Error) => {

         console.log('Plan.service - error: ' + Error);
      } 

    ); 

  } /* end on init */



  onPlan(planName: string) {

    debugger;  
    var cust = this.storageService.fetchCustomer(); 
    cust.custPlan = planName.toString().trim(); 
    var closureThis = this;
    let result = this.updatePlan(cust, closureThis);    

  }

  

  updatePlan(cust: Cust, closureThis: any) {
 
    debugger;      

    var planParm = new PlanParm();
    planParm.CustId = cust.custId.toString().trim();
    planParm.CustPlan = cust.custPlan.toString().trim(); 
    // add token
    planParm['_csrf'] = this.tokenService.getToken() 
    planParm['signal'] = "parmBack";
    //
    closureThis.cust = cust;
    this.selectedPlan = planParm.CustPlan;

    this.customerService.updatePlan(planParm).subscribe(

      () => {
 
           debugger;  
           this.storageService.storeCustomer(closureThis.cust);
           this.appService.setMessage('Plan ' + closureThis.selectedPlan + ' selected');
           this.router.navigate(['/hub']);   
      },
      (Error) => {

        debugger; 
        closureThis.message = "Could not update customer plan: " + Error;  

      } 

    );  
  } 

  onCancel(): void {

 
    this.router.navigate(['/hub']);   

   }
}
