/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import * as React from 'react';
import { FunctionComponent, useState, useEffect, createRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';

import { StudentNote } from '../../Models';
import { StudentDetailNote } from './StudentDetailNote';

import { StyledBuzzButton } from '../../globalstyle';
import ApiService from '../../Services/ApiService';
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

  &&& > div.survey-modal-dialog {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
  }
`;

interface StudentDetailNotesContainerProps {
  notes: StudentNote[];
  staffkey: number;
  studentschoolkey: string;
  apiService: ApiService;
}

export const StudentDetailNotesContainer: FunctionComponent<StudentDetailNotesContainerProps> = (
  props: StudentDetailNotesContainerProps
) => {
  const [notes, setNotes] = useState<Array<StudentNote>>(props.notes);
  const [keyToDelete, setKeyToDelete] = useState<number>();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>();

  const addNoteButtonRef = createRef<HTMLDivElement>();

  const cancelStudentNote = () => {
    setIsAdding(false);
  };

  const addStudentNote = () => {
    setIsAdding(true);
  };

  const saveStudentNote = (note: string) => {
    props.apiService.studentNotesApiService
      .addStudentNote(props.staffkey, props.studentschoolkey, note.trim())
      .then((result) => {
        const newNote = new StudentNote();
        newNote.studentnotekey = result.studentnotekey;
        newNote.studentschoolkey = props.studentschoolkey;
        newNote.staffkey = props.staffkey;
        newNote.note = note;
        newNote.dateadded = Date.now().toString();

        const currentTeacher = props.apiService.authentication.currentUserValue.teacher;
        props.apiService.teacher.getStaffNameByKey(currentTeacher.staffkey).then((author) => {
          newNote.staffFullName = 'Me';
          if (newNote.staffkey !== currentTeacher.staffkey) {
            newNote.staffFullName = `${author.firstname} ${author.lastsurname}`;
            newNote.staffEMail = author.electronicmailaddress;
          }
        });

        const newNotes: Array<StudentNote> = [newNote].concat(notes);
        setNotes(newNotes);
      });
    setIsAdding(false);
  };

  const deleteStudentNote = (staffkey: number, studentnotekey: number) => {

    setKeyToDelete(studentnotekey);
    setShowModal(true);
  };

  const deletesNote = React.useCallback((staffkey: number, studentnotekey: number) => {
    if (!canDelete || !studentnotekey) {
      return;
    }
    const updatedNotes = notes.filter((note) => note.studentnotekey !== studentnotekey);
    props.apiService.studentNotesApiService.deleteStudentNote(staffkey, studentnotekey).then(() => {
      setNotes(updatedNotes);
    });
  }, [canDelete, notes, props.apiService.studentNotesApiService]);

  useEffect(() => {
    if (canDelete === undefined || !keyToDelete) {
      return;
    }

    deletesNote(props.staffkey, keyToDelete);
    setKeyToDelete(undefined);
    setShowModal(false);
    setCanDelete(undefined);
  }, [canDelete, deletesNote, keyToDelete, notes, props.apiService.studentNotesApiService, props.staffkey]);

  useEffect(() => {
    setNotes(props.notes);
  }, [props.notes]);

  return (
    <>
      {notes && (
        <StudentDetailNotes className='student-detail-notes-container'>
          {notes &&
            notes.length > 0 &&
            notes.map((note) => (
              <StudentDetailNote
                key={note.studentnotekey}
                note={note}
                deleteNoteFunc={deleteStudentNote}
                apiService={props.apiService}
              />
            ))}
          {isAdding && (
            <div className='student-detail-new-note-container'>
              <StudentDetailEditNote saveButtonFunc={saveStudentNote} cancelButtonFunc={cancelStudentNote} />
            </div>
          )}
          {!isAdding && (
            <div className='student-detail-add-note-container' ref={addNoteButtonRef}>
              <StyledBuzzButton
                className='add-note-button'
                onClick={() => {
                  addStudentNote();
                }}
                onKeyPress={() => {
                  addStudentNote();
                }}
                tabIndex={3}
              >
                Add a note
              </StyledBuzzButton>
            </div>
          )}
        </StudentDetailNotes>
      )}
      <Modal
        show={showModal}
        backdrop='static'
        className='survey-modal-dialog'
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete note</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Do you want to delete this note?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => {
              setCanDelete(false);
            }}
          >
              No
          </Button>
          <Button
            variant='primary'
            onClick={() => {
              setCanDelete(true);
            }}
          >
              Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
