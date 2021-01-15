
// Cust.ts

class Cust {

    custId: string = '';
    // screen password fields
    entered: string = ''; // missing pw ie11 unduplicate names in proc usage fix bug blank pw db.
    confirmed: string = '';
    Encrypted: string = '';
    custPassword: string = ''; // a30 needs this compat. database password data to db.
    custPass: string = '' // a45 needs this to register the customer a30.
    custFirst: string = '';
    custLast: string = '';
    custPhone: string = '';
    custEmail: string = '';
    custAddr1: string = '';
    custAddr2: string = '';
    custCity: string = '';
    custState: string = '';
    custZip: string = '';
    appId: string = '';
    custBirthDate: string = ' '; // added 2.23 compat
    custGender: string = ' ';
    custMiddle: string = ' ';
    custPlan: string = ' ';
    PromotionCode: string = ' ';
    extendColors: string = ' ';
    claimCount: number = 0;
    _csrf: string = '';


}

export default Cust;
