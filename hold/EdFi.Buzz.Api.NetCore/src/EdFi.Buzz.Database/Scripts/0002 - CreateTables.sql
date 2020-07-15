CREATE TABLE buzz.StudentSchool (
    StudentSchoolKey nvarchar(45) NOT NULL,
    StudentKey nvarchar(32) NOT NULL,
    SchoolKey nvarchar(30) NOT NULL,
    SchoolYear nvarchar(30) NULL,
    StudentFirstName nvarchar(75) NOT NULL,
    StudentMiddleName nvarchar(75) NULL,
    StudentLastName nvarchar(75) NULL,
    EnrollmentDateKey nvarchar(30) NULL,
    GradeLevel nvarchar(50) NOT NULL,
    LimitedEnglishProficiency nvarchar(50) NULL,
    IsHispanic bit NOT NULL,
    Sex nvarchar(50) NOT NULL,
    PictureURL nvarchar(256) NULL,
    CONSTRAINT PK_StudentSchoolKey PRIMARY KEY (StudentSchoolKey)
);

GO

CREATE TABLE buzz.ContactPerson (
    UniqueKey nvarchar(65) NOT NULL,
    ContactPersonKey nvarchar(32) NOT NULL,
    StudentKey nvarchar(32) NOT NULL,
    ContactFirstName nvarchar(75) NOT NULL,
    ContactLastName nvarchar(75) NOT NULL,
    RelationshipToStudent nvarchar(50) NOT NULL,
    StreetNumberName nvarchar(150) NOT NULL,
    ApartmentRoomSuiteNumber nvarchar(50) NULL,
    State nvarchar(50) NOT NULL,
    PostalCode nvarchar(17) NOT NULL,
    PhoneNumber nvarchar(24) NULL,
    PrimaryEmailAddress nvarchar(128) NULL,
    IsPrimaryContact bit NULL,
    PreferredContactMethod varchar(128) NULL,
    BestTimeToContact varchar(60) NULL,
    ContactNotes varchar(max) NULL,
    CONSTRAINT PK_UniqueKey PRIMARY KEY (UniqueKey)
);

GO

CREATE TABLE buzz.StudentContact (
    ContactKey nvarchar(65) NOT NULL,
    StudentSchoolKey nvarchar(45) NOT NULL,
    CONSTRAINT PK_UniqueKey_StudentSchoolKey PRIMARY KEY (ContactKey, StudentSchoolKey),
    CONSTRAINT FK_StudentContact_ContactKey_UniqueKey FOREIGN KEY (ContactKey) REFERENCES buzz.ContactPerson (UniqueKey),
    CONSTRAINT FK_StudentContact_StudentSchoolKey_StudentSchoolKey FOREIGN KEY (StudentSchoolKey) REFERENCES buzz.StudentSchool (StudentSchoolKey)
);

GO

CREATE TABLE buzz.Section (
    SectionKey nvarchar(128) NOT NULL,
    SchoolKey nvarchar(32) NULL,
    LocalCourseCode nvarchar(60) NULL,
    SessionName nvarchar(60) NULL,
    SectionIdentifier nvarchar(255) NULL,
    SchoolYear smallint NOT NULL,
    CONSTRAINT PK_SectionSectionKey PRIMARY KEY (SectionKey)
)

GO

CREATE TABLE buzz.StudentSection (
    StudentSectionKey nvarchar(60) NOT NULL,
    StudentSchoolKey nvarchar(64) NOT NULL,
    StudentKey nvarchar(32) NOT NULL,
    SectionKey nvarchar(60) NULL,
    LocalCourseCode nvarchar(60) NULL,
    Subject nvarchar(60) NOT NULL,
    CourseTitle nvarchar(60) NOT NULL,
    TeacherName nvarchar(max) NULL,
    StudentSectionStartDateKey nvarchar(30) NULL,
    StudentSectionEndDateKey nvarchar(30) NULL,
    SchoolKey nvarchar(30) NULL,
    SchoolYear nvarchar(30) NULL,
    CONSTRAINT PK_StudentSectionKey PRIMARY KEY (StudentSectionKey)
);

GO

CREATE TABLE buzz.Staff (
    StaffKey int NOT NULL,
    PersonalTitlePrefix nvarchar(30) NULL,
    FirstName nvarchar(75) NULL,
    MiddleName nvarchar(75) NULL,
    LastSurname nvarchar(75) NULL,
    StaffUniqueId nvarchar(32) NOT NULL,
    CONSTRAINT PK_StaffStaffKey PRIMARY KEY (StaffKey)
)

GO

CREATE TABLE buzz.StaffSectionAssociation (
    StaffKey int NOT NULL,
    SectionKey nvarchar(128) NOT NULL,
    BeginDate datetime2 NOT NULL,
    EndDate datetime2 NULL,
    CONSTRAINT PK_StaffSectionAssociationStaffKeySectionKey PRIMARY KEY (StaffKey,SectionKey),
    CONSTRAINT FK_StaffSectionAssociation_StaffKey_StaffKey FOREIGN KEY (StaffKey) REFERENCES buzz.Staff (StaffKey),
    CONSTRAINT FK_StaffSectionAssociation_SectionKey_SectionKey FOREIGN KEY (SectionKey) REFERENCES buzz.Section (SectionKey)
)

GO
