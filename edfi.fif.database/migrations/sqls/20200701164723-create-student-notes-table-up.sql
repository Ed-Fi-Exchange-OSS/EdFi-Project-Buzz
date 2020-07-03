CREATE TABLE fif.StudentNote (
    StudentNoteKey INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    Note varchar(512) NOT NULL,
    StudentSchoolKey varchar(45) NOT NULL,
    CONSTRAINT PK_StudentNotes_StudentNoteKey PRIMARY KEY (StudentNoteKey),
    CONSTRAINT FK_StudentNotes_StudentSchoolKey_StudentSchoolKey FOREIGN KEY (StudentSchoolKey) REFERENCES fif.StudentSchool (StudentSchoolKey)
);
