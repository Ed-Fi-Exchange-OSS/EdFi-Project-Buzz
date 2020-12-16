/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import * as React from 'react';
import { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';
import StudentNote from '../../Models/StudentNote';
import { StyledBuzzButton } from '../../globalstyle';
import ApiService from '../../Services/ApiService';

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

  useEffect(() => {
    const currentTeacher = props.apiService.authentication.currentUserValue.teacher;
    const studnote: StudentNote = {...props.note};
    props.apiService.teacher.getStaffNameByKey(currentTeacher.staffkey).then((author) => {
      studnote.staffFullName = 'Me';
      if (studnote.staffkey !== currentTeacher.staffkey) {
        studnote.staffFullName = `${author.firstname} ${author.lastsurname}`;
        studnote.staffEMail = author.electronicmailaddress;
      }
    });

    setNote(studnote);
  }, [props.note, props.apiService.authentication.currentUserValue.teacher, props.apiService.teacher]);

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
              <span>{note && note.dateadded && new Date(parseInt(note.dateadded.toString(), 10)).toLocaleDateString()}</span>
            </div>
            <div>
              <span className='label'>Added by:</span>
              <span>{note.staffEMail ? <a href={`mailto:${note.staffEMail}`}>{note.staffFullName}</a> : note.staffFullName}</span>
            </div>
          </div>
          <div>
            <div>
              <StyledBuzzButton
                className='Edit Note'
                onClick={() => props.deleteNoteFunc(note.staffkey, note.studentnotekey)}
                onKeyPress={() => props.deleteNoteFunc(note.staffkey, note.studentnotekey)}
                tabIndex={0}
              >
                Delete Note
              </StyledBuzzButton>
            </div>
          </div>
        </StyledStudentNoteRow>
      )}
    </>
  );
};
