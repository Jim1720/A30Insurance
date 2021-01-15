import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdjustmentService {

  constructor() { }

  claimToAdjust: string = '';
  
  setClaimToAdjust(claimIdNumber: string) {

    debugger; 
    this.claimToAdjust = claimIdNumber;
  }

  getClaimIdToAdjust() : string {

     var claimIdNumber = this.claimToAdjust;
     this.claimToAdjust = ''; 
     return claimIdNumber;

  }
  clearClaimToAdjust() {
    
    this.claimToAdjust = '';
  }
}

export default AdjustmentService;
