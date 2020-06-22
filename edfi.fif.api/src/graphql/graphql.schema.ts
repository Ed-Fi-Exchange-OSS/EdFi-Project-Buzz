
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export abstract class IQuery {
    abstract staff(): Staff[] | Promise<Staff[]>;

    abstract sectionsbystaff(staffkey: string): Staff | Promise<Staff>;

    abstract sections(): Section[] | Promise<Section[]>;

    abstract section(sectionkey: string): Section | Promise<Section>;

    abstract students(): StudentSchool[] | Promise<StudentSchool[]>;

    abstract student(studentschoolkey: string): StudentSchool | Promise<StudentSchool>;

    abstract surveys(): Survey[] | Promise<Survey[]>;

    abstract survey(surveykey: string): Survey | Promise<Survey>;
}

export class Section {
    sectionkey?: string;
    schoolkey?: string;
    localcoursecode?: string;
    sessionname?: string;
    sectionidentifier?: string;
    schoolyear?: number;
    students?: StudentSchool[];
}

export class StudentSchool {
    studentschoolkey?: string;
    studentkey?: string;
    schoolkey?: string;
    schoolyear?: string;
    studentfirstname?: string;
    studentmiddlename?: string;
    studentlastname?: string;
    enrollmentdatekey?: string;
    gradelevel?: string;
    limitedenglishproficiency?: string;
    ishispanic?: boolean;
    sex?: string;
    pictureurl?: string;
}

export class Staff {
    staffkey?: number;
    personaltitleprefix?: string;
    firstname?: string;
    middlename?: string;
    lastsurname?: string;
    staffuniqueid?: string;
    sections?: Section[];
}

export class StudentSection {
    studentsectionkey?: string;
    studentschoolkey?: string;
    studentkey?: string;
    sectionkey?: string;
    localcoursecode?: string;
    subject?: string;
    coursetitle?: string;
    teachername?: string;
    studentsectionstartdatekey?: string;
    studentsectionenddatekey?: string;
    schoolkey?: string;
    schoolyear?: string;
}

export class Data {
    question?: string;
    answer?: string;
}

export class Metadata {
    timestamp?: string;
    studentschoolkey?: string;
    studentname?: string;
    studentemail?: string;
}

export class Question {
    question?: string;
}

export class Answer {
    metadata?: Metadata;
    data?: Data[];
}

export class SurveyJson {
    questions?: Question[];
    answers?: Answer[];
}

export class Survey {
    surveykey?: string;
    title?: string;
    info?: SurveyJson[];
}
