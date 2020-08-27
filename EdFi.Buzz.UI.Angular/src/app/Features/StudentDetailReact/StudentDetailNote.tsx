/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import * as React from 'react';
import { FunctionComponent, useState, useEffect } from 'react';
import { StudentNote } from 'src/app/Models';
import styled from 'styled-components';

const StyledStudentNoteRow = styled.div`
  display: flex;
  flex-direction: row;
  & > div {
    flex: 1;
    display: flex;
  }

  .shown-div {
    background-color: beige;
    display: flex;
    flex: 1;
  }

  .hide-div {
    display: none;
  }
`;

interface StudentDetailNoteProps {
  note: StudentNote;
}

export const StudentDetailNote: FunctionComponent<StudentDetailNoteProps> = (
  props: StudentDetailNoteProps,
) => {
  const [note, setNote] = useState<StudentNote>();

  useEffect(() => {
    console.log(`note:>${props.note}`);
    setNote(props.note);
  }, []);

  return (
    <>
      {note && (
        <StyledStudentNoteRow>{note.note}</StyledStudentNoteRow>
      )}
    </>
  );
};
