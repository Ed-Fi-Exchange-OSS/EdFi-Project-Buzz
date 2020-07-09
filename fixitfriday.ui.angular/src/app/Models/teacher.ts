import { Section } from "./section";

export class Teacher {
  id: string;
  sections: Section[];

  staffid: string;
  staffkey: string;
  personaltitleprefix: string;
  lastsurname: string;
  firstname: string;
  middlename: string;
  electronicmailaddress: string;


  constructor() {
    this.sections = [];
  }
}
