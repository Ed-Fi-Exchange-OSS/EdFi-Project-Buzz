/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import * as React from 'react';
import { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';

import { ApiService } from 'src/app/Services/api.service';
import { Student, Teacher, ContactPerson } from 'src/app/Models';
import { EmailIcon, LeftArrowIcon, StarIcon, PhoneIcon } from '../common/Icons';
import { StudentDetailContactCard } from './StudentDetailContactCard';

const StudentDetailContainer = styled.div`
  margin: 1em 1em 1em 1em;
  display: flex;
  flex-direction: column;
  width: 100%;

  .student-detail-top {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    height: 15rem;
    background-color: var(--white-lilac);
    padding-left: 2rem;
    padding-right: 2rem;
    padding-top: 1.5rem;
  }

  .student-detail-bottom {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    height: 100%;
    background-color: white;
    padding: 2rem;
  }

  .student-detail-go-back-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: center;
    width: 100%;
    height: 2rem;

    & > div {
      padding: 0.3rem;
      width: min-content;
      flex: 1;
      height: auto;
      justify-content: flex-start;
    }

    & > img {
      height: auto;
      width: auto;
      align-self: center;
      justify-self: center;
    }
  }

  .student-detail-profile-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    padding-bottom:1.4rem;
  }

  .student-detail-profile-pic-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    align-content: flex-start;
  }

  .student-detail-go-back-label {
    flex: 1;
    justify-items: flex-start;
    color: var(--denim);
  }

  .student-detail-name {
    justify-self: center;
  }

  .student-profile-grade-level {
    color: var(--iron);
    font-style: italic;
  }

  .student-profile-pic {
    width: 98px;
    height: 98px;
  }

  .image-container {
    border-radius: 0;
    padding-right: 1.5rem;
    align-items: flex-start;
  }

  .student-detail-profile-info-container {
    display: flex;

    @media (max-width: 768px) {
      flex-direction: column;
    }

    @media (min-width: 769px) {
      flex-direction: row;
      width: fit-content;
      justify-content: space-around;
      & > div {
        justify-content: flex-start;
      }
    }
  }

  .student-detail-profile-info-primary-contact {
    min-width: 20rem;
  }

  .student-profile-email {
    min-width: 15rem;
  }

  .student-detail-guardians-siblings-container {
    display: flex;
    flex-direction: column;
    width: 100%;

    .label {
      display: flex;
      justify-content: flex-start;
      padding-bottom: 2rem;
    }
  }

  .guardians-siblings {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    overflow-x: auto;

    & > div {
      flex: 1;
    }
  }
`;

export interface StudentDetailComponentProps {
  studentId: string;
  api: ApiService;
}

export const StudentDetail: FunctionComponent<StudentDetailComponentProps> = (props: StudentDetailComponentProps) => {
  const [studentId, setStudentId] = useState<string>('');
  const [student, setStudent] = useState<Student>();
  const [contacts, setContacts] = useState<Array<ContactPerson>>();
  const [siblings, setSiblings] = useState<Array<Student>>();
  const [primaryContact, setPrimaryContact] = useState<ContactPerson>();
  const [currentTeacher, setCurrentTeacher] = useState<Teacher>();

  useEffect(() => {
    const getStudent = async () => {
      const result = await props.api.student.getById(props.studentId);
      setStudent(result);
      setContacts(result.contacts);
      setSiblings(result.siblings);
      const pc = result.contacts.filter((c) => c.isprimarycontact === true)[0] || result.contacts[0];
      setPrimaryContact(pc);
    };

    try {
      setStudentId(props.studentId);
      setCurrentTeacher(props.api.authentication.currentUserValue.teacher);
      getStudent();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <>
      {student && (
        <StudentDetailContainer>
          <div className="student-detail-top">
            <a href={'/'} className="student-detail-go-back-container">
              <LeftArrowIcon />
              <div className="student-detail-go-back-label">Go back to Class Roster</div>
            </a>
            <div className="student-detail-profile-container">
              <div className="student-detail-profile-pic-container">
                <div className="image-container">
                  <img className="student-profile-pic" src={student.pictureurl} alt={`${student.name} Profile Picture`} />
                </div>
                <div className="student-detail-name">
                  <h1>{student.name}</h1>
                  {student.gradelevel && <div className="student-profile-grade-level">Grade: {student.gradelevel}</div>}
                  <div className="student-detail-profile-info-container">
                    {student.primaryemailaddress && (
                      <div className="student-profile-email">
                        <EmailIcon />
                        <a
                          className="text-ellipsis"
                          href={`mailto:${student.primaryemailaddress}`}
                          title={student.primaryemailaddress}
                        >
                          {student.primaryemailaddress}
                        </a>
                      </div>
                    )}
                    {primaryContact && (
                      <div className="student-detail-profile-info-primary-contact">
                        <StarIcon />
                        <span className="primary-contact-label bold-text">Primary Contact:</span>
                        <span className="primary-contact-name">{`${primaryContact.contactfirstname}&nbsp;${primaryContact.contactlastname}`}</span>
                      </div>
                    )}
                    {!student.primaryemailaddress && <p className="alert alert-primary">No email</p>}
                  </div>
                  <div className="student-detail-profile-pinned-info-container"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="student-detail-bottom">
            <div className="student-detail-guardians-siblings-container">
              <div className="label h2-desktop">Guardians&nbsp;/&nbsp;Siblings</div>
              <div className="guardians-siblings">
                {contacts &&
                  contacts.length > 0 &&
                  contacts.map((contact) => <StudentDetailContactCard key={contact.uniquekey} contact={contact} />)}
              </div>
            </div>
          </div>
        </StudentDetailContainer>
      )}
    </>
  );
};
