/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import * as React from 'react';
import { FunctionComponent, useState, useEffect, MouseEvent } from 'react';
import { StudentNote } from 'src/app/Models';
import styled from 'styled-components';
import { StyledBuzzButton } from 'src/globalstyle';
import { ApiService } from 'src/app/Services/api.service';

const StyledStudentNoteRow = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: ${(props) => props.theme.border};

  & > div {
    flex: 1;
    flex-direction: row;
    display: flex;
  }
`;

interface StudentDetailNoteProps {
  note: StudentNote;
  deleteNoteFunc: (staffkey: number, studentnotekey: number) => void;
  apiService: ApiService;
}

export const StudentDetailNote: FunctionComponent<StudentDetailNoteProps> = (props: StudentDetailNoteProps) => {
  const [note, setNote] = useState<StudentNote>();
  const [isEditing, setIsEditing] = useState<Boolean>(false);

  const toggleEditNote = () => {
    setIsEditing(!isEditing);
  };

  const removeNote = () => {
    console.log(`Deleting staffkey:>${note.staffkey}, studentnotekey:>${note.studentnotekey}`);
    props.apiService
      .studentNotesApiService.deleteStudentNote(note.staffkey, note.studentnotekey);
  };

  useEffect(() => {
    console.log(`note:>${JSON.stringify(props.note)}`);
    setNote(props.note);
  }, []);

  return (
    <>
      {note && (
        <StyledStudentNoteRow>
          <div className='note-text'>
            <div>
              <span className='label'>Note:</span>
              <span>{note.note}</span>
            </div>
          </div>
          <div className='note-author'>
            <div>
              <span className='label'>Date:</span>
              <span>{new Date(parseInt(note.dateadded.toString(), 10)).toLocaleDateString()}</span>
            </div>
            <div>
              <span className='label'>Added by:</span>
              <span>{note.staffEMail ? <a href={note.staffEMail}>{note.staffFullName}</a> : note.staffFullName}</span>
            </div>
          </div>
          <div>
            <div>
              <StyledBuzzButton className='Edit Note' onClick={() => toggleEditNote()}>
                Edit Note
              </StyledBuzzButton>
              <StyledBuzzButton className='Edit Note' onClick={() => props.deleteNoteFunc(note.staffkey, note.studentnotekey)}>
                Delete Note
              </StyledBuzzButton>
            </div>
          </div>
        </StyledStudentNoteRow>
      )}
    </>
  );
};
