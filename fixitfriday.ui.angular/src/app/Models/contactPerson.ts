export class ContactPerson {
    uniquekey: string;
    contactpersonkey: string;
    studentkey: string;

    contactfirstname: string;
    contactlastname: string;

    relationshiptostudent: string;

    //Address
    streetnumbername: string;
    apartmentroomsuitenumber: string;
    state: string;
    postalcode: string;

    phonenumber: string;
    primaryemailaddress: string;
    isprimarycontact: boolean
    preferredcontactmethod: string;
    besttimetocontact: string;
    contactnotes: string;
}