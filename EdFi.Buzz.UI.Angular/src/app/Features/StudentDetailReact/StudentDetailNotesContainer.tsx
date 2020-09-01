/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import * as React from 'react';
import { FunctionComponent, useState, useEffect, createRef } from 'react';
import { StudentNote } from 'src/app/Models';
import { StudentDetailNote } from './StudentDetailNote';
import styled from 'styled-components';
import { StyledBuzzButton } from 'src/globalstyle';
import { ApiService } from 'src/app/Services/api.service';
import { StudentDetailEditNote } from './StudentDetailEditNote';

const StudentDetailNotes = styled.div`
  display: flex;
  flex-direction: row;

  & > div {
    flex: 1;
    display: flex;
    justify-content: center;
  }


  .student-detail-add-note-container {
    padding-top: 1.5rem;
    flex: 1;
    display: flex;
    flex-direction: row;

    & > button {
      width: fit-content;
    }
  }

  .student-detail-new-note-container {
    padding-top: 1.5rem;
  }
`;

interface StudentDetailNotesContainerProps {
  notes: StudentNote[];
  staffkey: number;
  studentschoolkey: string;
  apiService: ApiService;
}

export const StudentDetailNotesContainer: FunctionComponent<StudentDetailNotesContainerProps> = (
  props: StudentDetailNotesContainerProps,
) => {

  const [notes, setNotes] = useState<Array<StudentNote>>(props.notes);
  const [isAdding, setIsAdding] = useState<Boolean>(false);

  const addNoteButtonRef = createRef<HTMLDivElement>();

  const cancelStudentNote = () => {
    setIsAdding(false);
  };

  const addStudentNote = () => {
    setIsAdding(true);
  };

  const saveStudentNote = (note: string) => {
    props.apiService.studentNotesApiService
      .addStudentNote(
        props.staffkey,
        props.studentschoolkey,
        note.trim())
      .then(result => {
        const newNote = new StudentNote();
        newNote.studentnotekey = result.studentnotekey;
        newNote.studentschoolkey = props.studentschoolkey;
        newNote.staffkey = props.staffkey,
        newNote.note = note;
        newNote.dateadded = Date.now().toString();

        const currentTeacher = props.apiService.
          authentication.currentUserValue.teacher;
          props.apiService.teacher.getStaffNameByKey(currentTeacher.staffkey).then((author) => {
            newNote.staffFullName = 'Me';
            if (newNote.staffkey !== currentTeacher.staffkey) {
              newNote.staffFullName = `${author.firstname} ${author.lastsurname}`;
              newNote.staffEMail = author.electronicmailaddress;
            }
          });

        const newNotes: Array<StudentNote> = ([newNote]).concat(notes);
        setNotes(newNotes);
      }) ;
    setIsAdding(false);
  };

  const deleteStudentNote = (staffkey: number, studentnotekey: number) => {

    const updatedNotes = notes.filter(note => note.studentnotekey !== studentnotekey);
    props.apiService
      .studentNotesApiService.deleteStudentNote(staffkey, studentnotekey)
      .then(() => {
        setNotes(updatedNotes);
      });
  };

  useEffect(() => {
    setNotes(props.notes);
  }, []);

  return (
    <>
      {notes && (
        <StudentDetailNotes className='student-detail-notes-container'>
          {notes && notes.length > 0 &&
            notes.map((note) =>
              <StudentDetailNote
                key={note.studentnotekey}
                note={note}
                deleteNoteFunc={deleteStudentNote}
                apiService={ props.apiService } />)}
          {isAdding && (
            <div className='student-detail-new-note-container'>
              <StudentDetailEditNote
                saveButtonFunc={saveStudentNote}
                cancelButtonFunc={cancelStudentNote} />
            </div>
          )}
          {!isAdding && (
            <div className='student-detail-add-note-container' ref={addNoteButtonRef}>
              <StyledBuzzButton
                className='add-note-button'
                onClick={() => {
                  addStudentNote();
                }}
              >
                Add a note
              </StyledBuzzButton>
            </div>
          )}
        </StudentDetailNotes>
      )}
    </>
  );
};
