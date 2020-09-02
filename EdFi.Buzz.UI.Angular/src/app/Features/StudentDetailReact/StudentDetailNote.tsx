/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import * as React from 'react';
import { FunctionComponent, useState, useEffect, MouseEvent } from 'react';
import { StudentNote, Teacher } from 'src/app/Models';
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

  const getNoteAuthor = (staffkey: number) => {
    let teacher = new Teacher();
    props.apiService.teacher.getStaffNameByKey(staffkey).then((staff) => {
      teacher = staff;
    });
    return teacher;
  };

  useEffect(() => {
    const currentTeacher = props.apiService.
      authentication.currentUserValue.teacher;
      props.apiService.teacher.getStaffNameByKey(currentTeacher.staffkey).then((author) => {
        props.note.staffFullName = 'Me';
        if (props.note.staffkey !== currentTeacher.staffkey) {
          props.note.staffFullName = `${author.firstname} ${author.lastsurname}`;
          props.note.staffEMail = author.electronicmailaddress;
        }
      });

    setNote(props.note);
  }, [props.note]);

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
              <StyledBuzzButton
                className='Edit Note'
                onClick={() => props.deleteNoteFunc(note.staffkey, note.studentnotekey)}
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
