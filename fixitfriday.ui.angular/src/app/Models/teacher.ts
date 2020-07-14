import { Section } from './section';

export class Teacher {
  sections: Section[];

  staffkey: number;
  personaltitleprefix: string;
  lastsurname: string;
  firstname: string;
  middlename: string;
  electronicmailaddress: string;


  constructor() {
    this.sections = [];
  }
}
