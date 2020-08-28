/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import * as React from 'react';
import { FunctionComponent, useState, useEffect, createRef, MouseEvent } from 'react';
import { StudentNote } from 'src/app/Models';
import { StudentDetailNote } from './StudentDetailNote';
import styled from 'styled-components';
import { StyledBuzzButton } from 'src/globalstyle';
import { ApiService } from 'src/app/Services/api.service';

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

  const [notes, setNotes] = useState<StudentNote[]>(props.notes);
  const [notesChanged, setNotesChanged] = useState<Boolean>(false);
  const [isAdding, setIsAdding] = useState<Boolean>(false);

  const addNoteRef = createRef<HTMLTextAreaElement>();
  const addNoteButtonRef = createRef<HTMLDivElement>();

  const addStudentNote = () => {
    console.log('add note');
    setIsAdding(true);
  };

  const saveStudentNote = () => {
    const note = addNoteRef.current.value;
    props.apiService.studentNotesApiService
      .addStudentNote(props.staffkey, props.studentschoolkey, note.trim())
      .then(result => {
        console.log('Save successful, notifying note change');
          setNotesChanged(true);
      }) ;
    setIsAdding(false);
  };

  const deleteStudentNote = (staffkey: number, studentnotekey: number) => {
    props.apiService
      .studentNotesApiService.deleteStudentNote(staffkey, studentnotekey)
      .then(result => {
        console.log('Delete successful, notifying note change');
        setNotesChanged(true);
      });
  }

  const cancelStudentNote = () => {
    console.log('cancel note');
    setIsAdding(false);
    addNoteRef.current.value = "";
  };

  useEffect(() => {

    if (!notesChanged) {
      return;
    }

    console.log('Notes have changed');
    props.apiService.student.getById(props.studentschoolkey)
      .then((s: Student) => {
        console.log(`notes are now:\n${JSON.stringify(s.notes)}`);
        setNotes(s.notes);
        setNotesChanged(false);
      });
  }, [notesChanged]);

  useEffect(() => {
    setNotes(props.notes);
    console.log(`notes are initialized as:\n${JSON.stringify(notes)}`);
  }, []);

  return (
    <>
      {notes && (
        <StudentDetailNotes className="student-detail-notes-container">
          {notes && notes.length > 0 &&
            notes.map((note, index) =>
              <StudentDetailNote
                key={index}
                note={note}
                deleteNoteFunc={deleteStudentNote}
                apiService={ props.apiService } />)}
          {isAdding && (
            <div className="student-detail-new-note-container">
              <textarea rows={6} cols={60} ref={addNoteRef} />
              <div>
                <StyledBuzzButton
                  className="save-note-button"
                  onClick={() => {
                    saveStudentNote();
                  }}
                >
                  Save
                </StyledBuzzButton>
                <StyledBuzzButton
                  className="save-note-button"
                  onClick={() => {
                    cancelStudentNote();
                  }}
                >
                  Cancel
                </StyledBuzzButton>
              </div>
            </div>
          )}
          {!isAdding && (
            <div className="student-detail-add-note-container" ref={addNoteButtonRef}>
              <StyledBuzzButton
                className="add-note-button"
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
