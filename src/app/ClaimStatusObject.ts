
// ClaimStatusObject.js - claim status object - used to pay claim 

class ClaimStatusObject {

   claimIdNumber: string = ''
   action: string = ''
   amount: string = ''
   date: string = ''
   plan: string  = '' 
   _csrf: string = ''
};

export default ClaimStatusObject;