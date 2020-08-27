/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import { FunctionComponent, useState, useEffect } from 'react';
import * as React from 'react';
import styled from 'styled-components';

import { ContactPerson } from 'src/app/Models';
import { EmailIcon, PhoneIcon } from '../common/Icons';

export interface StudentDetailContactCardProps {
  key: Number;
  contact: ContactPerson;
}

const StyledContactCard = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  background-color: var(--white-lilac);
  width: 300px;
  min-height: 50px;
  min-width: 308px;
  margin-right: 2rem;
  margin-bottom: 30px;
  padding: 15px 20px;
  border-radius: 4px;
  overflow: hidden;
  text-overflow: ellipsis;


  .contact-card-name {
    color: var(--shark);
    font-size: 18px;
    font-weight: 600;
    margin-right: 1.5rem;
  }

  .contact-main-container {
    display: flex;
    flex-direction: row;
    align-content: flex-start;
    justify-content: center;

    & > div {
      line-height: 1.7rem;
      justify-self: center;
      height: 2rem;
      flex : 1;
    }
  }

  .contact-preferences-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    font-weight: 600;

    & > div {
      max-width: 20rem;
      flex: 1;
      flex-wrap: wrap;
      font-size: 12px;
      margin-right: 1.5rem;
    }
  }
`;

export const StudentDetailContactCard: FunctionComponent<StudentDetailContactCardProps> = (
  props: StudentDetailContactCardProps,
) => {
  const [current, setCurrent] = useState<ContactPerson>(new ContactPerson());
  useEffect(() => {
    setCurrent(props.contact);
  }, []);

  return (
    <StyledContactCard>
      <div className='contact-main-container'>
        <div><span className='contact-card-name'>{`${current.contactfirstname} ${current.contactlastname}`}</span><span className='italics'> - {`${current.relationshiptostudent} ${current.isprimarycontact ? ' / Primary Contact' : ''}`}</span></div>
      </div>
      <div className='contact-contact-info'>
        {props.contact.primaryemailaddress && (
          <div className='contact-email'>
            <EmailIcon />
            {`${props.contact.primaryemailaddress}`}
          </div>
        )}
        <div>
          <PhoneIcon />
          {`${props.contact.phonenumber}`}
        </div>
      </div>
      <div className='contact-preferences-container'>
        <div>Preferred contact method: {current.preferredcontactmethod || 'None specified'}</div>
        <div>Best time to contact: {current.besttimetocontact || 'None specified'}</div>
      </div>
    </StyledContactCard>
  );
};
