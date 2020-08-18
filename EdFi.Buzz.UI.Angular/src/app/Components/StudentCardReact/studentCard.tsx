import { Student } from 'src/app/Models';
import { useState } from 'react';
import * as React from 'react';

import './studentCard.css';

import styled from 'styled-components';
import { EmailIcon, PhoneIcon, StarIcon } from '../../Features/common/Icons';
import ChevronDown from '../../../assets/chevron-down.png';
import ChevronUp from '../../../assets/chevron-up.png';

const StyledStudentCard = styled.div`
  font-family: ${(props) => props.theme.fonts.regular} !important;
  font-size: 14px;
  background-color: ${(props) => props.theme.colors.lavender};
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
    color: ${(props) => props.theme.colors.darkgray};
  }

  .primary-contact-label {
    font-size: 14px;
    color: ${(props) => props.theme.colors.darkgray};
  }

  .relationship {
    font-size: 14px;
  }

  :hover {
    outline-color: ${(props) => props.theme.colors.steelblue};
  }

  .d-flex {
    display: flex !important;
  }

  & .overflow-hidden {
    overflow: hidden !important;
  }

  & div.footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    font-family: ${(props) => props.theme.fonts.regular};
    font-weight: 600;
    color: ${(props) => props.theme.colors.steelblue};
    background-color: ${(props) => props.theme.colors.lavender};
    border-top: 1px solid ${(props) => props.theme.colors.lightgray};

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
    color: ${(props) => props.theme.colors.steelblue};
  }

  img.email-icon,
  img.phone-icon {
    margin: 0px 10px 0px 0px;
  }

  & img.star-icon {
    margin: 0px 5px 0px 0px;
  }

  & h3 {
    color: ${(props) => props.theme.colors.darkgray};
    font-family: ${(props) => props.theme.fonts.bold};
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

  div.outline-button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 3em;
    border: solid 2px #1378be;
    color: #1378be;
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

export function StudentCard(props: StudentCardComponentProps) {
  const student = props.student;
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <StyledStudentCard className='card'>
      <div className='student-card-body p-t-0'>
        <div className='d-flex p-t-12'>
          <a href={`#/app/studentDetail/${student.studentschoolkey}`}>
            <div className='image-container'>
              <img className='student-profile-pic' src={student.pictureurl} alt={`{student.name} Profile Picture`} />
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
                {student.contacts[0].streetnumbername} {student.contacts[0].apartmentroomsuitenumber}
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
            <div className='alert alert-primary'>Student have no contacts</div>
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
}
