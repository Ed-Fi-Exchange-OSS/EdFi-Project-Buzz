import { Student } from 'src/app/Models';
import { useState } from 'react';
import * as React from 'react';

import './StudentCard.css';

import styled from 'styled-components';
import Mail from '../../../assets/mail.png';
import OrangeChevron from '../../../assets/chevron-orange.png';

const StyledStudentCard = styled.div`
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

  :hover {
    outline-color: ${(props) => props.theme.colors.steelblue};
  }

  & div.footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    font-family: ${(props) => props.theme.fonts.regular};
    font-weight: 600;
    color: ${(props) => props.theme.colors.steelblue};

    & img.flip {
      transform: scaleX(-1);
    }

    & img {
      justify-self: center;
      align-self: center;
      margin: 10px 10px 10px 10px;
      width: 14px;
      height: 8px;
    }
  }

  & div.primary-contact {
    display: flex;
    flex-direction: row;

    div {
      flex: 1;
    }

    div.primary-contact-name {
      flex: 3;
    }

    div.primary-contact-phone {
      flex: 2;
    }
  }

  & a {
    color: ${(props) => props.theme.colors.steelblue};
  }

  & img.email-image {
    height: 10px;
    width: 16px;
    margin: 0px 10px 0px 0px;
  }

  & h3 {
    color: ${(props) => props.theme.colors.darkgray};
    font-family: ${(props) => props.theme.fonts.bold};
    font-size: 18px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
  }

  & div.image-container {
    height: 48px;
    width: 48px;
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
      <div className='card-body p-t-0'>
        <div className='d-flex p-t-12'>
          <div>
            <a href={`#/app/studentDetail/${student.studentschoolkey}`}>
              <div className='image-container'>
                <img src={student.pictureurl} alt={`{student.name} Profile Picture`} />
              </div>
            </a>
          </div>
          <div className='flex-grow-1 overflow-hidden'>
            <h3 className='m-b-2 d-flex'>{student.name}</h3>
            {student.primaryemailaddress && (
              <div>
                <img className='email-image' src={Mail} />
                <a
                  className='m-b-2 text-ellipsis'
                  href='mailto:{{student.primaryemailaddress}}'
                  title='{{student.primaryemailaddress}}'
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
            <div className='primary-contact'>
              <div className='primary-contact-name'>
                Primary Contact&nbsp;-&nbsp;
                <i>{student.contacts[0].relationshiptostudent}</i> {student.contacts[0].contactlastname},{' '}
                {student.contacts[0].contactfirstname}
              </div>
              <div></div>
              <div className='primary-contact-phone'>
                <a className='inline-block' href='tel:{{student.contacts[0].phone}}'>
                  {student.contacts[0].phonenumber}
                </a>
              </div>
            </div>
          )}
          {(!student.contacts || student.contacts.length === 0) && (
            <div className='alert alert-primary'>Student has no contacts</div>
          )}
        </div>

        <div className={`collapse ${isCollapsed ? 'show' : ''}`}>
          <hr />
          <h3>Primary Contact</h3>
          {student.contacts && student.contacts.length > 0 && (
            <p className='m-l-10'>
              <span className='text-muted block'>
                {student.contacts[0].contactlastname}, {student.contacts[0].contactfirstname}(
                {student.contacts[0].relationshiptostudent})
              </span>
              <i className='icon ion-md-mail'></i>&nbsp;
              <a className='m-b-2 ' href='mailto:{{student.contacts[0].primaryemailaddress}}'>
                {student.contacts[0].primaryemailaddress}
              </a>
              <br />
              <i className='icon ion-md-phone-portrait'></i>&nbsp;
              <span className='text-muted'>
                <a href='tel:{{student.contacts[0].phonenumber}}'>{student.contacts[0].phonenumber}</a>
              </span>
              <span className='text-muted block'>
                {student.contacts[0].streetnumbername} {student.contacts[0].apartmentroomsuitenumber}
              </span>
            </p>
          )}
          {(!student.contacts || student.contacts.length === 0) && (
            <div className='alert alert-primary'>Student have no contacts</div>
          )}

          {student.contacts &&
            student.contacts.length > 0 && (
              <h4>
                Preferred Contact Method: <span className='text-muted'>{student.contacts[0].preferredcontactmethod}</span>
              </h4>
            ) && (
              <h4>
                Best time to contact: <span className='text-muted'>{student.contacts[0].besttimetocontact}</span>
              </h4>
            )}

          <a
            href={`#/app/studentDetail/${student.studentschoolkey}`}
            className='btn btn-block btn-outline-primary btn-rounded mt-3'
          >
            Survey Results
          </a>
          <hr />
          <h3>Notes</h3>
          {student.contacts &&
            student.contacts.map((contact) => (
              <p
                className='text-muted m-b-2'
                key={[student.studentschoolkey, contact.contactlastname, contact.contactfirstname].join()}
              >
                {contact.contactnotes}
              </p>
            ))}
        </div>
      </div>

      <div className='footer card-footer'>
        <div>{!isCollapsed ? 'View more' : 'Collapse'}</div>
        <img className={!isCollapsed ? '' : 'flip'} src={OrangeChevron} onClick={() => setIsCollapsed(!isCollapsed)} />
      </div>
    </StyledStudentCard>
  );
}
