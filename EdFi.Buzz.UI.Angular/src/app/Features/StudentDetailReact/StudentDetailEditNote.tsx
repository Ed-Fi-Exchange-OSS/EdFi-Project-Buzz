/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import * as React from 'react';
import { RefObject, FunctionComponent, createRef } from 'react';
import { StyledBuzzButton } from 'src/globalstyle';

interface StudentDetailEditNoteProps {
  saveButtonFunc: (note: string) => void;
  cancelButtonFunc: () => void;
}

export const StudentDetailEditNote: FunctionComponent<StudentDetailEditNoteProps> = (
  props: StudentDetailEditNoteProps) => {

  const noteRef = createRef<HTMLTextAreaElement>();

  const saveNote = () => {
    props.saveButtonFunc(noteRef.current.value);
  };

  return (
    <div>
      <textarea rows={6} cols={60} ref={ noteRef } />
      <div>
        <StyledBuzzButton
          className='save-note-button'
          onClick={saveNote}
        >
          Save
        </StyledBuzzButton>
        <StyledBuzzButton
          className='save-note-button'
          onClick={ props.cancelButtonFunc }
        >
          Cancel
        </StyledBuzzButton>
      </div>
    </div>
  );
};
