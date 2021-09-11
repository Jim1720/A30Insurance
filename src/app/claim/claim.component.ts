import { Component, OnInit, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';  
import { ClaimService } from '../claim.service'; 
import Claim from '../Claim';
import { StorageService } from '../storage.service'; 
import { Router } from '@angular/router'; 
import { AdjustmentService } from  '../adjustment.service';
import AdjustmentClaimData from '../adjustmentClaimData'; 
import { AppService } from '../app.service';
import ColorInfoObject from '../ColorInfoObject';
import { dateservice } from '../dateservice';

import { TokenService } from '../token.service';
import { ServiceService } from '../service.service'; 
import ServiceInfo from '../ServiceInfo';
import { PlanService } from '../plan.service';
import PlanInfo from '../PlanInfo';
import { ScreenStyleNotificationSerevice } from '../screen.style.nofification.service';
import { ScreenStyleInterfaceService } from '../screen.style.interface.service';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css']
}) 

export class ClaimComponent implements OnInit {

  // behaviours: claim type reveals fields.
  // behaviours: field by field reveal of diag/proc codes.
  // others -- check advanced features of angular --
 

  constructor(private claimService: ClaimService,
              private storageService : StorageService, 
              private adjustmentService : AdjustmentService,
              private appService : AppService,
              private dateService: dateservice,
              private tokenService: TokenService,
              private serviceService: ServiceService,
              private planService: PlanService,
              private notificationService: ScreenStyleNotificationSerevice,
              private styleInterface: ScreenStyleInterfaceService,
              private router: Router) { 


 
  }
 
  allServices: ServiceInfo[] = []; // ServiceName, ClaimType, Cost.
  typeServices: ServiceInfo[] = []; // filter for claim type // display on screen  
  serviceSelect : string = ''  // = '' on new claims or = service on adj / to select list entry.   
  custPlanName: string = ''; 

  // dropdown service box.
  defaultService: string = '' ; // set initial selection 
  modelService: string = ''; // calc reads this and it set to first or adjust service
  newClaim: boolean = true;   


  // what shows as first row in option box [Select], or value'
  ClaimIsNew: boolean = true;
  ClaimIsAdjustment: boolean = false;
  claimSelectPrompt: string = '[Select Option]';
  priorOptinSelection: string ='';

  costParm = { Covered: '', Balance: ''}; 
  defaultClaimType: string = 'm'; 

  title: string = "New Claim";
  messages : string[] = [];
  showAdjustedNumber: boolean = false;
  goodEdit: boolean = false;
  defaultPlanNumber: string = "Plan1";
  today: string = '';
  yy: number = 0;// added 3.1.20
  time: string = '';
  showMedical: boolean = false;
  showDental: boolean = false;
  showVision: boolean = false;
  showDrug: boolean = false; 
  showUnselected: boolean = true;
  custName: string = '';
  processAdjustment: boolean = false;
  claimIdToAdjust: string = '';
  claimToAdjust: any = null;
  claimStatus: string = '';
  adjustedDate: string = ''; 

  // initially set fields for new claim.
  patientFirst:string = '';
  patientLast:string = '';
  claimDescription:string = '';
  claimDateService:string = '';
  procedureCodes:string = '';
  diagnosisCodes:string = '';
  service: string = '';  // adjustgments MUST set this field since the Select is based on onChange!
                         // there may be a limitation on changing the type of claim on adjustments due to this setup.   
  physician:string = '';
  totalCharge:string = '0.0';
  clinicName:string = '';   
  DateConfine:string = '';
  DateRelease:string = '';
  toothNumber:string = '';
  eyeware:string = '';
  drugName:string = '';

  // following reveal fields based on valu8es...
  registeredClaimType: string = "u";
  procedureCount: number = 1;
  errors: boolean = false;
  dateConstant: string = '1900/01/01';
  dateHasDefaulted: string = "default"; // editor copy failed. could be 01011753. 

  // formattedDates for database: fdDateService 
  fdDateService: string = '';
  fdEntryDate: string = '';
  fdDateConfine: string = '';
  fdDateRelease: string = '';

  // highlight claim types
  mColor: string = '';
  dColor: string = '';
  vColor: string = '';
  xColor: string = '';

  showPics: string = ''; 
  useColor: string = ''; 
  labelColor: string = '';
  hcolor: string = '';
  fieldColor: string = ''; // blue adjustment fields (blue adjustment logic)
 
  headerStyle: string = '';
  labelStyle: string = '';
  messageStyle: string = '';
  claimStyleClass: string = '';

  defaultLabelColor: string = "dodgerblue";
  defaultMessageColor  : string = "burleywood";
  defaultHeaderColor : string = "white";

  userStyle : string = '';

  lineMessage = "";
  
  ngOnInit() {
 
 
        var notSignedIn = this.appService.notSignedIn();  
        if (notSignedIn == true) {
        
          this.router.navigate(['/splash']);    

        }

        debugger;
        var Claim = "claim";
        var Style = "Style";
        var defaultLabelColor = "dodgerblue";
        var defaultHeaderColor = "white";
        var defaultMessageColor = "white";
        var Solid = "solid";
        var semi = ";"; 
        var headerOffset = "margin-left:  90px; ";  

        var screenStyleObject = this.styleInterface.getStyleObject(Claim);
        if(screenStyleObject != null)
        {
          
          // external class = style link value 
          this.claimStyleClass = screenStyleObject.externalClass;
          this.userStyle = 'color: ' + screenStyleObject.userColor;
          if(screenStyleObject.internalClass == Solid)
          {
            this.userStyle = 'background-color: ' + screenStyleObject.userColor;
          }
          this.labelStyle = 'color: ' + screenStyleObject.labelColor;
          this.headerStyle = 'color: ' + screenStyleObject.headerColor  
          this.messageStyle = 'color: ' + screenStyleObject.messageColor;

        }
        else
        { 
            // no style object exists until user clicks style link.  
            this.claimStyleClass = Style;
            this.userStyle = 'color: ' + " white; ";
            this.labelStyle = 'color: ' + defaultLabelColor;
            this.headerStyle = 'color: ' + defaultHeaderColor  
            this.messageStyle = 'color: ' + defaultMessageColor;

        } 
 
        // when type is set/changed 'filterTypeServices' must 
        // be called to sync services for that claim type.
        
              // read data from api.
       this.serviceService.makeServicesAvailable().subscribe(

            (serviceInfo: ServiceInfo[]) => {

                this.allServices = serviceInfo;
             //   console.log('ng init ' + serviceInfo.length + ' services read.');
                this.ContinueInit();


            },
            (Error) => {

                console.log('ngInit = service call returns error ' + Error);

            }); 

       }

    show() {

       for(var i = 0; i < this.allServices.length; i++) {

           var row : any = null;
           row = this.allServices[i];
           console.log('----');
           console.log('all service row: row: ' + row);
           for(var a in row) {
             console.log(`${a} ${row[a]}`);
           }

       }

    }

    showt() {

      for(var i = 0; i < this.typeServices.length; i++) {

          var row: any = null;
          row = this.typeServices[i];
          console.log('----');
          console.log('type service row: row: ' + row);
          for(var a in row) {
            console.log(`/${a}/${row[a]}/`);
          }

      }

   }


       
    ContinueInit() { 

     //  this.show();

  
    //   this.showt();

       debugger;
 
          
        this.getCurrentDate();  

        this.custName = this.storageService.fetchNames(); 

      // check for adjustment process using adjustment service to see if
      // adjustment was requested from the history screen. also if yes,
      // the claim service will be used to stamp the field on adjusted claim.
      // and this , claim the adjusting claim is inserted as a new claim 
      // call to server.

      // set this.defaultValue for service combo box if adjustment...
      this.checkAdjustment(); 

   
  }

  postAdjustmentCheckLogic() {

      // gets called from read adj claim i/o and other paths to make
      // sure the async are done properly. Had issues with await usages! 

         // must be performed after adjustment check. 
      // sets up this.typeServices - for default medical until screen type changed.
 
        
     // this.showPics = this.appService.getFormat();

     this.notificationService.subject.subscribe(
      // import ColorInfoObject from '../ColorInfoObject';
      // next branch
      (cio:ColorInfoObject) => {

        debugger;

        this.claimStyleClass = cio.externalClass;
        this.userStyle = 'color: ' + cio.userColor;
        if(cio.externalClass == "bg-solid")
        {
            this.userStyle = 'background-color: ' + cio.userColor;
        }
        this.labelStyle = 'color: ' + cio.labelColor;
        this.headerStyle = 'color: ' + cio.headerColor;
        this.messageStyle = 'color: ' + cio.messageColor;  
             
      },

      // error branch
      (Error:any) => {

          console.log('Error in claim subscription ' + Error);
      }
      
     ); 
  }

  onServiceChange(target: any) {
    // 8.1.21 value removed  - deterimine value of target fix needed
    // todo: get value 
    debugger;  
    var value:any  = target.value;
    //this.modelService = name.toString().trim();
  }
 

  filterTypeServices(selectedValue:any) {

     // clear and filter a new service list based on 
     // selected claim type.
     // selectedValue = m,d,v,x
     // type service = "Medical", "Dental";
   //  console.log('* filter type services');
     debugger;
     var type = 'unknown';
     switch(selectedValue) {
         case 'm' :  type = "Medical"; break;
         case 'd' :  type = "Dental"; break;
         case 'v' :  type = "Vision"; break;
         case 'x' :  type = "Drug"; break;
         default: type = "Unknown";

     }   
     
     // drop down values added in loadScreenFields, the adj cost and adj service name... 
     this.loadTypeServices(selectedValue); 
  } 

  loadTypeServices(type:any) {

      debugger;
      var outIndex = 0;   
      this.typeServices = [];  
      //
      // set defaultService on new claims and on 'entering' claims that change type.
      // 

      this.defaultService = ''; 

      for(var i = 0; i < this.allServices.length; i++) {

        var row = this.allServices[i];
         // add matching type only
         if(row["ClaimType"] != type) {
           continue; // skip
         }

         this.typeServices[outIndex] = this.trimServiceName(this.allServices[i]); 
         outIndex++; 

         // default selection for dropdown service box.
         if(this.defaultService === '') {

          // use first service for this type for new claims or 
          // any claim with a type change selected.

             this.defaultService = row['ServiceName'].toString().trim(); 
             this.modelService = this.defaultService;
         }   
      }  
  }
  
  trimServiceName(s:any) {

     for(var a in s) {

        if(a === 'ServiceName') { // simplify coding on html.
 
          var work = s[a];
          s[a] = work.toString().trim();

        } 
     } 
     return s;
  }
  onType(selectedValue: string) :  void { 

     // initalize or change claim type... 
     
     let reset:boolean = this.registeredClaimType === "u" 
         || this.registeredClaimType !== selectedValue;
     
     if (reset) {

        this.showUnselected = false;
        this.showMedical = ( selectedValue == 'm' ) ? true: false;
        this.showDental = ( selectedValue == 'd' ) ? true :false;
        this.showVision = ( selectedValue == 'v' ) ? true :false;
        this.showDrug = ( selectedValue == 'x' ) ? true :false;  
        this.registeredClaimType = selectedValue;
        //-this.message = selectedValue; 
        this.mColor = (selectedValue == "m") ? 'pink' : 'white'; 
        this.dColor = (selectedValue == "d") ? 'aqua' : 'white';
        this.vColor = (selectedValue == "v") ? 'goldenrod' : 'white'; 
        this.xColor = (selectedValue == "x") ? 'lawngreen' : 'white';

        this.filterTypeServices(selectedValue);

     
     }
  }
 

  onCancel(): void { 
     
    this.router.navigate(['/hub']);   

  }

  
  onSubmitClaim(): void {  
 
 
      // find the plan percent based on the customer plan id.
      this.custPlanName = this.storageService.getPlanName().toString().trim()
      if(this.custPlanName === undefined || this.custPlanName === null || this.custPlanName === '') {
        
        //this.messages[0] = "Customer has no assigned plan. Please select one.";
        this.lineMessage = "Customer has no assigned plan. Please select one.";
        return;
      }
     this.performEdits();
     if (this.errors === true) 
     {
       return;
     } 
  

     let claim: Claim = new Claim(); 
     claim.PlanId = this.custPlanName; 
     // all fields should be upcased to match db names
     claim.PatientFirst = this.patientFirst;
     claim.PatientLast = this.patientLast;
     claim.ClaimDescription = this.claimDescription;
     claim.CustomerId = this.storageService.fetchCustomerId().trim();
     claim.ClaimIdNumber = this.assignIdNumber(); 
     claim.Diagnosis1 = this.diagnosisCodes;
     claim.Diagnosis2 = ''; // unused
     claim.Procedure1 = this.procedureCodes;
     claim.Procedure2 = ''; // unused
     claim.TotalCharge = this.totalCharge;
     claim.Physician = this.physician;
     claim.Clinic = this.clinicName;
    // this.fdDateService =  this.editDate(this.claimDateService,'doFormat') 
     claim.DateService = this.fdDateService;
     claim.ClaimType = this.registeredClaimType; // not on form but on class.
     claim.LastUpdated = this.today;
     claim.DateAdded = this.today;
     claim.AdjustedClaimId = '';
     claim.AdjustingClaimId = '';  

     // added for compatability.
     claim.PaymentAction = '';
     claim.PaymentAmount = 0.0;
     claim.PaymentDate = '01/01/1753';
     claim.PaymentPlan = '';
     claim.Referral = '';
     claim.AdjustedDate = '01/01/1753';
     claim.AppAdjusting = ''; 
     // populate object data at array index 
     debugger; 
     claim.ServiceItem = '';
     claim.Location = '';
     // end added fields.

      // if left blank - default.
      if (this.DateConfine === "") {
          claim.DateConfine = this.dateConstant;

      } else {
           
          claim.DateConfine = this.fdDateConfine;
      }
     
      if (this.DateRelease === "") {
        claim.DateRelease = this.dateConstant;

      } else {
             
            claim.DateRelease = this.fdDateRelease;
      }

 
     claim.ToothNumber = this.toothNumber;
     claim.Eyeware = this.eyeware;
     claim.DrugName = this.drugName;  
     claim.ClaimStatus = "Entered";
 
     debugger; 
     var service = this.modelService.toString().trim(); 
     claim.Service = service;
 
    debugger;
    this.clearUnusedFields(claim);

    // adjustment chaining
    if(this.processAdjustment) {

        // set adjusting and adjusted claim numbers 
        // claim being adjusted.
 
        claim.AdjustingClaimId = claim.ClaimIdNumber;
        claim.AdjustedClaimId= this.claimIdToAdjust;
        claim.ClaimStatus = "Adjustment";

        // remember: when add succeeds we have to stamp origional 
        // claim with this claim id number.

    } 

    // calculate covered amount

    var closureThis = this; 
  

 //   console.log("check after service change probable blow up undefined");
  //  console.log(" this.service = " + this.service);

    this.calculateCoveredAmountForPlan(claim, closureThis);
   

  }

  calculateCoveredAmountForPlan(claim:Claim, closureThis:any)  {

//    console.log('calc cost - claim.Service is:' + claim.Service);
    // get cost from type services matching service select.
    // get customer plan for percent covered.
 
    debugger;
   serviceCost = 0.0; 
   for(var i = 0 ; i < this.typeServices.length; i++) {
     
      var row = this.typeServices[i];
      var name = row["ServiceName"].toString().trim();
      if( name == claim.Service) { 
         var cost = row['Cost']; 
         var serviceCost = parseFloat(cost); 
      }

   };
    // get plan list
 

    this.planService.readPlans().subscribe( 

      (planInfoData:any) => {

          
      //   console.log(" *** plan info read from service ");  
         var planInfo: PlanInfo[] = planInfoData; 

          // lookup the percent covered in the plan
          var percent = 0.0;  

          /* ie 11  var planRow = planInfo.filter(pi => {

              var piPlanName = pi.PlanName.toString(); 
              var matchPlan = (piPlanName == custPlanName); 
              return matchPlan;
              
          }); */
          debugger;
          var matchPlan = false;
          var percent = 0.0;
          for(var i = 0; i <  planInfo.length; i++) {

              var row = planInfo[i];
              var plan = row['PlanName'].toString().trim();
              //console.log('if pp /' + plan + '/' + closureThis.custPlanName + '/');
              if(plan === closureThis.custPlanName) {
                   matchPlan = true;
                   percent = parseFloat(row['Percent']);
              }

          } 
     
          // calculate the amount covered and balance.
          var covered = (percent * serviceCost) / 100; 
          var balance = serviceCost - covered;

        //  console.log('calc results: covered:' + covered + ' balance:' + balance);
          debugger;
          claim.TotalCharge = serviceCost.toString();
          claim.CoveredAmount = covered.toString();
          claim.BalanceOwed = balance.toString();
 
      
          // add token
          claim._csrf = this.tokenService.getToken(); 
      
          this.insertClaim(claim);    

      },
      (Error) => {

         console.log('Plan.service - error: ' + Error);
      } 

    ); 
  

  }

  performEdits() {
 
      this.errors = false; 
      this.lineMessage = "";

      this.messages = [];
      this.editFields();
      if(this.goodEdit === false) {
        this.errors = true;
        return;
      } 

      if(this.registeredClaimType == 'u') {

           this.errors = true;
           // this.messages[0] = "A claim type must be selected from menu at left.";
           this.lineMessage = "A claim type must be selected from menu at left.";
           return;

      } 
   
       /* edit service field for selection made if yes calc total charge
          based on service percent */
       /* service-edit */
      
      debugger; 
      //var serviceFound = this.typeServices.find(ts => ts['ServiceName'] == this.service)
      var serviceFound = false;
      var editService = this.modelService.toString().trim();

      for(var i = 0; i < this.typeServices.length; i++)
      {
          var row = this.typeServices[i];
          var name = row['ServiceName'].toString().trim();
          if( name == editService ) {
            serviceFound = true;
          }
      }
      if(serviceFound == false) { 

        //this.messages[0] = "Please select a service.";
        this.lineMessage = "Please select a service.";
        this.errors = true; 
        return;
      }   

  

      var editDateParm = { input: "", screen: "", valid: false, formatted: "", message: ""}
      editDateParm.input = this.claimDateService;
      editDateParm.screen = "claim"; 
      debugger;
      this.dateService.editDate(editDateParm);  
      if(!editDateParm.valid) { 

            //this.messages[0] = editDateParm.message;
            this.lineMessage = editDateParm.message;
            this.errors = true; 
            return;
      }  
      else {

           this.fdDateService = editDateParm.formatted; 
      }  

      if(this.registeredClaimType === "m") { 

        if(this.DateConfine !== "")  {
          // edit if not blank else use default date
          editDateParm.input = this.DateConfine;
          editDateParm.screen = "claim"; 
          debugger;
          this.dateService.editDate(editDateParm);  
              if(!editDateParm.valid) { 
                // this.messages[0] = editDateParm.message;  
                this.lineMessage = editDateParm.message;
                this.errors = true;
                return;
              }  
              else { 
                this.fdDateConfine = editDateParm.formatted; 
               }
        } /* end date confine edit */

        
        if(this.DateRelease !== "")  {
          // edit if not blank else use default date
            editDateParm.input = this.DateRelease;
            editDateParm.screen = "claim"; 
            debugger;
            this.dateService.editDate(editDateParm); 

            if(!editDateParm.valid) { 
              //this.messages[0] = editDateParm.message; 
              this.lineMessage = editDateParm.message;
              this.errors = true;
              return;
            } 
            else {  
               this.fdDateRelease = editDateParm.formatted;   
            }   
          } /* end date release edit */ 
          
          
          var confine = new Date(this.DateConfine); 
          var release = new Date(this.DateRelease); 
          var service = new Date(this.claimDateService); 

          if (confine > release) { 
            //this.messages[0] = 'confine date is later than release date.'; 
            this.lineMessage = 'confine date is later than release date.';
            this.errors = true;
            return;
          }  
          if (service < confine || service > release) {
            // this.messages[0] = 'service date not within confine dates.'; 
            this.lineMessage = 'service date not within confine dates.';
            this.errors = true;
            return;
          }  
      }

      if(this.registeredClaimType === "d") {

         
        if( isNaN(parseFloat(this.toothNumber)) == true)  {

          // this.messages[0] = 'invalid tooth number'; 
          this.lineMessage = 'invalid tooth number';
          this.errors = true;
          return;

        }
      }

      if (this.registeredClaimType === "v" ) {

          if(this.eyeware.length === 0) {

           // this.messages[0] = 'value for eyeware required on vision claim.'; 
            this.lineMessage = 'value for eyeware required on vision claim.';
            this.errors = true;
            return;

          }

      };


      if (this.registeredClaimType === "x") { 

        if(this.drugName.length === 0) {

         // this.messages[0] = 'value for drug name required on drug claim.'; 
          this.lineMessage= 'value for drug name required on drug claim.';
          this.errors = true;
          return;

        }

      }
  } 

  clearUnusedFields(claim: Claim) {

        // clear fields
 

        if(claim.ClaimType != 'm') {

            claim.DateConfine = this.dateConstant
            claim.DateRelease = this.dateConstant
        }

        if(claim.ClaimType != 'd') {

            claim.ToothNumber = "0";
        }

        if(claim.ClaimType != 'v') {

             claim.Eyeware = " "; 
        }

        if(claim.ClaimType != 'x') {
          
          claim.DrugName = " ";

        }




  }

  insertClaim(claim:Claim) {

    let result : boolean = false;

    this.claimService.addClaim(claim).subscribe(

      () => {
   
        if (this.processAdjustment === true)
        { 
            let adjustmentClaimData = new AdjustmentClaimData();
            // current , adjusting claim.
            adjustmentClaimData.AdjustmentIdNumber =  claim.ClaimIdNumber;
            // one to adjust...
            adjustmentClaimData.ClaimIdNumber = this.claimIdToAdjust;
            adjustmentClaimData.AdjustedDate = this.today;
            adjustmentClaimData.AppAdjusting = "A30";
            this.stampAdjustedClaim(adjustmentClaimData);
          
         }

         // note: the above if causes control to transfer permanently so 
         // this statment is only for non-adjustement logic.
         debugger; 
         var a = claim.ClaimIdNumber;
         // ie 11  var msg = `Claim ${a} has been successfully filed.`; 
         var msg = 'Claim ' + a + ' has been successfully filed.';
         this.appService.setMessage(msg); 
         
         this.router.navigate(['/hub']);   

      },
      (Error) => {

        debugger;
        console.log('add claim:' + Error);
        //this.messages[0] = "Could not add claim: " + Error;  
        this.lineMessage = "Could not add claim: " + Error; 
      }
      
    ); 

  } 

  stampAdjustedClaim(adjustedClaimData:AdjustmentClaimData) { 
     
    let result : boolean = false; 
    var a = adjustedClaimData.ClaimIdNumber;
    var b = adjustedClaimData.AdjustmentIdNumber;

      
      // add token
      adjustedClaimData['_csrf'] = this.tokenService.getToken();

      this.claimService.stampClaim(adjustedClaimData).subscribe(

      () => {
  
        this.adjustmentService.clearClaimToAdjust();


        // set successful adjustment message
        // ie 11 var msg = `Claim ${a} has been adjusted by ${b}`;
        var msg = 'Claim ' + a + ' has been adjusted by ' + b;
        this.appService.setMessage(msg); 
        
        this.router.navigate(['/history']);   

      },
      (Error) => {

        debugger;
        console.log('errpr in stamp claim:' + Error);
        //this.messages[0] = "Could not stamp claim: " + Error;  
        this.lineMessage = "Could not stamp claim: " + Error; 

      }
      
    ); 


  }

  assignIdNumber(): string {
 
    var id= 'CL-' + this.today + '-' + this.time; 
    return id;

  }

  pad2 (value: number) : string {

    var v: string = value.toString();
    var r: string = (v.length < 2 ) ? '0' + v : v;
    return r; 

  }

  getCurrentDate() : void {
     
     let d = new Date();
     let yyyy = d.getFullYear();
     let mm = d.getMonth() + 1;
     let dd = d.getDate(); 
     let hh = d.getHours();
     let mi = d.getMinutes();
     let ss = d.getSeconds();
     this.today = yyyy + '-' + this.pad2(mm) + '-' + this.pad2(dd);  
     this.time = this.pad2(hh) + ':' + this.pad2(mm) + '-' + this.pad2(ss); 
     this.yy = parseInt(yyyy.toString().substring(2,4)); 

  }

  
  editFields() {

    this.goodEdit = true;

    var name1 = "^[a-zA-Z0-9\\s\\-\\.]+$";   // cust id / password
    var name2 = "^[a-zA-Z0-9.#\\s\\-\\.]+$"; // city names 
    
    var name2s = "^[a-zA-Z0-9.#\\s\\-\\.]+$ || \\s"; // city names 
    var pd = "^[0-9]{4}|\s$"; // diag proc

    var msg: string[] = [];
    var pat1 = new RegExp(name1);
    var pat2 = new RegExp(name2);  
    var pat2s = new RegExp(name2s);

    var pDiagProc = new RegExp(pd);

    if(!pat1.test(this.patientFirst.trim())) { 
        msg.push('invalid first name '); 
    }
    if(!pat1.test(this.patientLast.trim())) {
      msg.push('invalid last name '); 
    } 
    if(!pat2s.test(this.claimDescription.trim())) { 
        msg.push('invalid claim description'); 
     }
     if(!pDiagProc.test(this.diagnosisCodes.trim())) {
      msg.push('invalid diagnosis code'); 
     } 
     if(!pDiagProc.test(this.procedureCodes.trim())) {
      msg.push('invalid procedure code'); 
     } 
     if(!pat2.test(this.clinicName.trim())) {
      msg.push('invalid clinic name'); 
     } 
     if(!pat2.test(this.physician.trim())) {
      msg.push('invalid physician name'); 
     }   
    

     if(msg.length === 0) {

      return; 

     }
       
     this.goodEdit = false;

     this.lineMessage = "";
     var prefix = " * ";
     
     for(var item of msg) {
       this.messages.push(item);
       this.lineMessage += prefix;
       this.lineMessage += item;
     }


     return;

    }
 
 
 

    checkAdjustment() {

      // if we are adjusting claim , get it and show message. 
      debugger;
      this.claimIdToAdjust = this.adjustmentService.getClaimIdToAdjust()
      this.fieldColor="black";
      if(this.claimIdToAdjust.length > 0) {  
            this.ClaimIsNew = false;
            this.newClaim = false;
            this.ClaimIsAdjustment = true;
            this.processAdjustment = true;  
            var closureThis = this;
            this.readClaimToAdjust(this.claimIdToAdjust, closureThis); 
            this.fieldColor="blue"; 
            
      }  else {  
        
           // setScreenFields calls onType for adjustments when it loads claim
           // screen fields.
           this.onType(this.defaultClaimType);
           this.postAdjustmentCheckLogic();

      }

      // may not be supported on ie. 
      // app service limits color borders.
      debugger;
      let root = document.documentElement; 
      root.style.setProperty('--adj-color', this.fieldColor); 

 
    }

    readClaimToAdjust(claimIdToAdjust: string, closureThis: any) {  

      let result : boolean = false;
  
      this.claimService.readClaim(claimIdToAdjust).subscribe(
  
        (claim:any) => {
   
          debugger;
          result = true;  
          closureThis.showAdjustedNumber = true;  // show on form at top.
          closureThis.claimToAdjust = claim[0];
       //   console.log('read claim to adj - cta/s is ' + closureThis.claimToAdjust.Service); 
          // 
          closureThis.setScreenFields();
          closureThis.messages[0] = "Success - claim read to adjust."; 

          //
          closureThis.postAdjustmentCheckLogic();
  
        },
        (Error) => {
  
          debugger;
          //this.messages[0] = "Could not read claim: to adjust " + Error;  
          this.lineMessage = "Could not read claim: to adjust " + Error;  
        } 
  
      );  
    }

   
 

    setScreenFields() { 

        debugger;
       
        // copy data from 'claimToAdjust' to screen fields before display
        // set up adjusted claim id number and adjusting claim id number too.

        //this.messages[0] = `Claim Id ${this.claimIdToAdjust} being adjusted by this new claim.`;
        
        this.lineMessage = `Claim Id ${this.claimIdToAdjust} being adjusted by this new claim.`;
       
        this.title = "Claim Adjustment";
              
        // initially set fields for adjusting claim.
        
        debugger;
        this.onType(this.claimToAdjust.ClaimType);
        this.patientFirst  = this.claimToAdjust.PatientFirst.trim();
        this.patientLast  = this.claimToAdjust.PatientLast.trim();
        this.claimDescription  = this.claimToAdjust.ClaimDescription.trim();
        // ****** needs ATTENTION ****** 
        // check claim add for all fields on sql query in a45
        // handling of diag and proc codes
        // edits on first, last to begin with.

        // here we are setting screen fields from the
        // claim being adjusted. 
        // note customer can change claim type: waiting for business feedback! on this. 
        this.claimDateService  = this.pullDate(this.claimToAdjust.DateService); 
        this.procedureCodes = this.claimToAdjust.Procedure1.trim(); // proc 2 not used
        this.diagnosisCodes = this.claimToAdjust.Diagnosis1.trim(); // diag 2 not used 
        this.physician  =  this.claimToAdjust.Physician.trim();
        this.totalCharge  = this.claimToAdjust.TotalCharge.toString().trim(); 
        this.clinicName  = this.claimToAdjust.Clinic.trim(); 
 
        // default Service dropdown selection.
        this.defaultService = this.claimToAdjust.Service.toString().trim();


        debugger; 

        if (this.claimToAdjust.ClaimType === 'm') {  
            debugger;
            this.DateConfine  = this.pullDate(this.claimToAdjust.DateConfine);
            this.DateRelease  = this.pullDate(this.claimToAdjust.DateRelease);  
            if(this.DateConfine === this.dateHasDefaulted) {
              this.DateConfine = "";
            }
            if(this.DateRelease == this.dateHasDefaulted) {
              this.DateRelease = "";
            }
        
        }

        if (this.claimToAdjust.ClaimType === 'd') { 

              this.toothNumber = this.claimToAdjust.ToothNumber;
        }

        if (this.claimToAdjust.ClaimType === 'v') {

              this.eyeware = this.claimToAdjust.Eyeware.trim();
        }

        if (this.claimToAdjust.ClaimType === 'x') {

              this.drugName = this.claimToAdjust.DrugName.trim();
        } 

    }

    pullDate(value:string): string {  
        
        var work = value.substring(0,10);
        var yy = work.substring(0,4);
        if ( yy === "1900" || yy === "1753")
        {
           return 'default';
        } 
        yy = work.substring(0,2);
        var mm = work.substring(5,7);
        var dd = work.substring(8,10);
        var out = mm + dd + yy; 
        return out;
        
    }
 
}
