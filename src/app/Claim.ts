//
// claim.ts
//

class Claim {

    PatientFirst: string = '';
    PatientLast: string = '';
    ClaimIdNumber: string = '';
    ClaimDescription: string = '';
    CustomerId: string = '';
    PlanId: string = '';
    Diagnosis1: string = '';
    Diagnosis2: string = ''; // not used
    Procedure1: string = '';
    Procedure2: string = ''; // not used
    Physician: string = '';
    Clinic: string = '';
    DateService: string = '';
    TotalCharge: string = '';
    DateAdded: string = '';
    LastUpdated: string = ''; // unused
    ClaimStatus: string = '';
    AdjustedClaimId: string = '';
    AdjustingClaimId : string = '';
    AdjustedDate: string = '';
    //
    ClaimType: string = '' // M,D,V,X
    // by claim type
    DateConfine: string = '';
    DateRelease: string = '';
    //
    ToothNumber: string = '';
    //
    Eyeware: string = '';
    //
    DrugName: string = '';
    // 
    // 2.23 for compatability.
    //
    Service: string= '';
    ServiceItem: string= '';
    Location: string= '';
    //
    PaymentAmount: number= 0;
    PaymentDate: string= '';
    PaymentPlan: string= '';
    PaymentAction: string= '';
    //
    CoveredAmount: string= '';
    BalanceOwed: string= '';
    //
    AppAdjusting: string= '';
    Referral: string= ''; 
    //
    _csrf: string= '';
    
};

export default Claim;
 