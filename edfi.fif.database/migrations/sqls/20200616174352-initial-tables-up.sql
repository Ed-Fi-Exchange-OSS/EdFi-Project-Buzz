CREATE TABLE fif.School(
    SchoolKey varchar NOT NULL,
    SchoolName varchar NOT NULL,
    SchoolType varchar NULL,
    SchoolAddress varchar NULL,
    SchoolCity varchar NULL,
    SchoolCounty varchar NULL,
    SchoolState varchar NULL,
    LocalEducationAgencyName varchar NULL,
    LocalEducationAgencyKey int NULL,
    StateEducationAgencyName varchar NULL,
    StateEducationAgencyKey int NULL,
    EducationServiceCenterName varchar NULL,
    EducationServiceCenterKey int NULL,
    LastModifiedDate date NULL,
    CONSTRAINT PK_SchoolKey PRIMARY KEY (SchoolKey)
);

CREATE TABLE fif.StudentSchool (
    StudentSchoolKey varchar(45) NOT NULL,
    StudentKey varchar(32) NOT NULL,
    SchoolKey varchar(30) NOT NULL,
    SchoolYear varchar(30) NULL,
    StudentFirstName varchar(75) NOT NULL,
    StudentMiddleName varchar(75) NULL,
    StudentLastName varchar(75) NULL,
    EnrollmentDateKey varchar(30) NULL,
    GradeLevel varchar(50) NOT NULL,
    LimitedEnglishProficiency varchar(50) NULL,
    IsHispanic bit NOT NULL,
    Sex varchar(50) NOT NULL,
    PictureURL varchar(256) NULL,
    CONSTRAINT PK_StudentSchoolKey PRIMARY KEY (StudentSchoolKey),
    CONSTRAINT FK_StudentSchool_SchoolKey FOREIGN KEY (SchoolKey) REFERENCES fif.School (SchoolKey)
);

CREATE TABLE fif.ContactPerson (
    UniqueKey varchar(65) NOT NULL,
    ContactPersonKey varchar(32) NOT NULL,
    StudentKey varchar(32) NOT NULL,
    ContactFirstName varchar(75) NOT NULL,
    ContactLastName varchar(75) NOT NULL,
    RelationshipToStudent varchar(50) NOT NULL,
    StreetNumberName varchar(150) NOT NULL,
    ApartmentRoomSuiteNumber varchar(50) NULL,
    State varchar(50) NOT NULL,
    PostalCode varchar(17) NOT NULL,
    PhoneNumber varchar(24) NULL,
    PrimaryEmailAddress varchar(128) NULL,
    IsPrimaryContact boolean NULL,
    PreferredContactMethod varchar(128) NULL,
    BestTimeToContact varchar(60) NULL,
    ContactNotes varchar(4000) NULL,
    CONSTRAINT PK_UniqueKey PRIMARY KEY (UniqueKey)
);

CREATE TABLE fif.StudentContact (
    ContactKey varchar(65) NOT NULL,
    StudentSchoolKey varchar(45) NOT NULL,
    CONSTRAINT PK_UniqueKey_StudentSchoolKey PRIMARY KEY (ContactKey, StudentSchoolKey),
    CONSTRAINT FK_StudentContact_ContactKey_UniqueKey FOREIGN KEY (ContactKey) REFERENCES fif.ContactPerson (UniqueKey),
    CONSTRAINT FK_StudentContact_StudentSchoolKey_StudentSchoolKey FOREIGN KEY (StudentSchoolKey) REFERENCES fif.StudentSchool (StudentSchoolKey)
);

CREATE TABLE fif.Section (
    SectionKey varchar(128) NOT NULL,
    SchoolKey varchar(32) NULL,
    LocalCourseCode varchar(60) NULL,
    SessionName varchar(60) NULL,
    SectionIdentifier varchar(255) NULL,
    SchoolYear smallint NOT NULL,
    CONSTRAINT PK_SectionSectionKey PRIMARY KEY (SectionKey)
);

CREATE TABLE fif.StudentSection (
    StudentSectionKey varchar(80) NOT NULL,
    StudentSchoolKey varchar(64) NOT NULL,
    StudentKey varchar(32) NOT NULL,
    SectionKey varchar(128) NULL,
    LocalCourseCode varchar(60) NULL,
    Subject varchar(60) NOT NULL,
    CourseTitle varchar(60) NOT NULL,
    TeacherName varchar(4000) NULL,
    StudentSectionStartDateKey varchar(30) NULL,
    StudentSectionEndDateKey varchar(30) NULL,
    SchoolKey varchar(30) NULL,
    SchoolYear varchar(30) NULL,
    CONSTRAINT PK_StudentSectionKey PRIMARY KEY (StudentSectionKey)
);

CREATE TABLE fif.Staff (
    StaffKey int NOT NULL,
    PersonalTitlePrefix varchar(30) NULL,
    FirstName varchar(75) NULL,
    MiddleName varchar(75) NULL,
    LastSurname varchar(75) NULL,
    StaffUniqueId varchar(32) NOT NULL,
    CONSTRAINT PK_StaffStaffKey PRIMARY KEY (StaffKey)
);

CREATE TABLE fif.StaffSectionAssociation (
    StaffKey int NOT NULL,
    SectionKey varchar(128) NOT NULL,
    BeginDate date NOT NULL,
    EndDate date NULL,
    CONSTRAINT PK_StaffSectionAssociationStaffKeySectionKey PRIMARY KEY (StaffKey,SectionKey),
    CONSTRAINT FK_StaffSectionAssociation_StaffKey_StaffKey FOREIGN KEY (StaffKey) REFERENCES fif.Staff (StaffKey),
    CONSTRAINT FK_StaffSectionAssociation_SectionKey_SectionKey FOREIGN KEY (SectionKey) REFERENCES fif.Section (SectionKey)
);

CREATE TABLE fif.Survey (
    SurveyKey varchar(128) NOT NULL,
    Title varchar(128) NOT NULL,
    Info json NOT NULL,
    CONSTRAINT PK_SurveySurveyKey PRIMARY KEY (SurveyKey)
);
