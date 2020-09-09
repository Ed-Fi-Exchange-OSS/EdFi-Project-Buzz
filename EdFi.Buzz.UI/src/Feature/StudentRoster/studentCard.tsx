// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import styled from 'styled-components';

import { useState } from 'react';
import * as React from 'react';
import { Student } from '../../Models/Student';

import './studentCard.css';
import { EmailIcon, PhoneIcon, StarIcon } from '../../common/Icons';
import ChevronDown from '../../assets/chevron-down.png';
import ChevronUp from '../../assets/chevron-up.png';

const StyledStudentCard = styled.div`
  font: ${(props) => props.theme.fonts.regular} !important;
  font-size: 14px;
  background-color: var(--white-lilac);
  border: ${(props) => props.theme.border};
  min-height: 175px;
  margin-bottom: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-clip: border-box;
  border-radius: 4px;

  .student-card-body {
    flex: 1 1 auto;
    min-height: 1px;
    padding: 0.6rem;
    color: var(--shark);
  }

  .primary-contact-label {
    font-size: 14px;
    color: var(--shark);
  }

  .relationship {
    font-size: 14px;
  }

  :hover {
    outline-color: var(--denim);
  }

  .d-flex {
    display: flex !important;
  }

  & .overflow-hidden {
    overflow: hidden !important;
  }

  & div.card-footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    font: ${(props) => props.theme.fonts.regular};
    font-weight: 600;
    color: var(--denim);
    background-color: var(--white-lilac);
    border-top: ${(props) => props.theme.border};

    & div {
      display: flex;
    }

    & img {
      justify-self: center;
      align-self: center;
      margin: 10px 10px 10px 10px;
      width: 14px;
      height: 8px;
    }
  }

  .bold {
    font-size: 14px;
    font-weight: 600 !important;
    line-height: 18px;
  }

  .clickable {
    cursor: pointer;
  }

  div.primary-contact-container {
    display: flex;
    flex-direction: row;
    margin: 5px 5px 5px 5px;

    div.primary-contact-name-container {
      flex: 2;
      font-size: 14px !important;
      font-weight: 600 !important;
      line-height: 18px;
      max-width: 65%;
    }

    div.primary-contact-phone-container {
      white-space: nowrap;
      flex: 1;
    }
  }

  & a {
    color: var(--denim);
  }

  img.email-icon,
  img.phone-icon {
    margin: 0px 10px 0px 0px;
  }

  & img.star-icon {
    margin: 0px 5px 0px 0px;
  }

  & h3 {
    color: var(--shark);
    font: ${(props) => props.theme.fonts.bold};
    font-size: 18px;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
  }

  & div.image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 5px 5px 5px;

    & > img {
      height: 48px;
      width: 48px;
    }
  }

  .outline-button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 3em;
    border-color: var(--denim) !important;
    border-style: solid;
    color:  var(--denim);
    font-weight: 600;
    border-radius: 4px;
    margin-top: 20px;
    margin-bottom: 20px;
    cursor: pointer;
  }
`;

export interface StudentCardComponentProps {
  student: Student;
}

export const StudentCard: React.FunctionComponent<StudentCardComponentProps> = (props: StudentCardComponentProps) => {
  const {student} = props;
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <StyledStudentCard className='card'>
      <div className='student-card-body p-t-0'>
        <div className='d-flex p-t-12'>
          <a href={`#/app/studentDetail/${student.studentschoolkey}`}>
            <div className='image-container'>
              <img className='student-profile-pic' src={student.pictureurl} alt={'{student.name} Profile Picture'} />
            </div>
          </a>
          <div className='flex-grow-1 overflow-hidden'>
            <span className='h2-desktop'>{student.name}</span>
            {student.primaryemailaddress && (
              <div>
                <EmailIcon />
                <a
                  className='m-b-2 text-ellipsis'
                  href={`mailto:${student.primaryemailaddress}`}
                  title={student.primaryemailaddress}
                >
                  {student.primaryemailaddress}
                </a>
              </div>
            )}
            {!student.primaryemailaddress && <p className='alert alert-primary'>No email</p>}
          </div>
        </div>

        <div className={`${isCollapsed ? 'collapse' : ''}`}>
          {student.contacts && student.contacts.length > 0 && (
            <div className='primary-contact-container'>
              <div className='primary-contact-name-container'>
                <div className='bold'>
                  <span className='primary-contact-label'>Primary Contact&nbsp;-&nbsp;</span>
                  <i className='relationship'>{student.contacts[0].relationshiptostudent}</i>
                </div>
                <div className='primary-contact-name'>
                  {student.contacts[0].contactlastname}, {student.contacts[0].contactfirstname}
                </div>
              </div>
              <div className='primary-contact-phone'>
                <PhoneIcon />
                {student.contacts[0].phonenumber ? (
                  <>
                    <a className='inline-block' href={`tel:${student.contacts[0].phonenumber}`}>
                      {student.contacts[0].phonenumber}
                    </a>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          )}
          {(!student.contacts || student.contacts.length === 0) && (
            <div className='alert alert-primary'>Student has no contacts</div>
          )}
        </div>

        <div className={`collapse ${isCollapsed ? 'show' : ''}`}>
          {student.contacts && student.contacts.length > 0 && (
            <div className='m-l-10'>
              <div className='bold'>
                <StarIcon />
                <span className='primary-contact-label'>Primary Contact&nbsp;-&nbsp;</span>
                <i className='relationship'>{student.contacts[0].relationshiptostudent}</i>
              </div>
              <div>
                {student.contacts[0].contactlastname}, {student.contacts[0].contactfirstname}
              </div>
              <EmailIcon />
              &nbsp;
              <a className='m-b-2 ' href={`mailto:${student.contacts[0].primaryemailaddress}`}>
                {student.contacts[0].primaryemailaddress}
              </a>
              <br />
              <PhoneIcon />
              &nbsp;
              <a href={`tel:${student.contacts[0].phonenumber}`}>{student.contacts[0].phonenumber}</a>
              <div>
                {student.contacts[0].contactaddress}
              </div>
              <div>
                <div className='bold'>Preferred contact method:</div>
                <div>{student.contacts[0].preferredcontactmethod}</div>
              </div>
              <div>
                <div className='bold'>Best time to contact:</div>
                <div>{student.contacts[0].besttimetocontact}</div>
              </div>
            </div>
          )}
          {(!student.contacts || student.contacts.length === 0) && (
            <div className='alert alert-primary'>Student has no contacts</div>
          )}
          <div className='outline-button'>
            <a href={`#/app/studentDetail/${student.studentschoolkey}`}>Student Details</a>
          </div>
        </div>
      </div>

      <div className='footer card-footer'>
        <div className='clickable' onClick={() => setIsCollapsed(!isCollapsed)}>
          <div>{!isCollapsed ? 'View more' : 'Collapse'}</div>
          <img src={!isCollapsed ? ChevronDown : ChevronUp} onClick={() => setIsCollapsed(!isCollapsed)} />
        </div>
      </div>
    </StyledStudentCard>
  );
};
